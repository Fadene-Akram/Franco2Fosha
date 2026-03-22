# from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
# import logging
# import torch
# import os

# logger = logging.getLogger(__name__)


# class TransliterationService:
#     def __init__(self):
#         self.models_config = {
#             'darija': './models/arabizi-to-darija',
#             'msa': './models/Zyadkh-arabizi-translator',
#         }

#         self.models = {}
#         self.tokenizers = {}

#         # Load every model defined in models_config
#         for name, path in self.models_config.items():
#             self._load_model(name, path)

#     def _load_model(self, name: str, model_path: str):
#         """Load a single model + tokenizer pair by name. Failures are logged but
#         don't crash the service — other models will still work."""
#         logger.info(f"Loading {name} model from {model_path}...")
#         try:
#             if not os.path.exists(model_path):
#                 raise Exception(
#                     f"Model '{name}' not found at {model_path}. "
#                     "Please download it first."
#                 )

#             logger.info(f"  Loading tokenizer for {name}...")
#             self.tokenizers[name] = AutoTokenizer.from_pretrained(
#                 model_path,
#                 local_files_only=True,
#                 use_fast=False
#             )

#             logger.info(f"  Loading model for {name}...")
#             self.models[name] = AutoModelForSeq2SeqLM.from_pretrained(
#                 model_path,
#                 local_files_only=True,
#                 torch_dtype=torch.float32
#             )

#             logger.info(f"✅ {name} model loaded successfully!")

#         except Exception as e:
#             logger.error(f"❌ Failed to load {name} model: {e}")
#             import traceback
#             traceback.print_exc()

#     def _compute_confidence(self, sequences_scores: list[float]) -> list[float]:
#         """
#         Convert raw sequence log-probabilities into a 0-100 confidence scale.

#         Each beam's score is a negative log-prob (more negative = less likely).
#         We exponentiate to get the raw probability, then scale to 0-100.
#         We also clamp so the top result is always >= the others.
#         """
#         if not sequences_scores:
#             return []

#         # exp(log_prob) -> probability in (0, 1]
#         raw_probs = [torch.exp(torch.tensor(score)).item() for score in sequences_scores]

#         # Normalise relative to the best score so top beam = 100 base
#         best = max(raw_probs) if raw_probs else 1.0
#         if best == 0:
#             return [0.0] * len(raw_probs)

#         confidences = []
#         for prob in raw_probs:
#             # Absolute confidence from the probability itself (sigmoid-like mapping)
#             # Maps prob in (0,1] -> score in (50, 95]
#             absolute = 50 + 45 * prob
#             # Relative confidence compared to the best beam
#             relative = (prob / best) * absolute
#             # Final score is the average of absolute and relative, clamped to [0, 100]
#             score = round(min(100.0, max(0.0, (absolute + relative) / 2)), 1)
#             confidences.append(score)

#         # Ensure no alternative exceeds the top result
#         if len(confidences) > 1:
#             top = confidences[0]
#             confidences = [top] + [min(c, top - 0.1) for c in confidences[1:]]

#         return confidences

#     def transliterate(self, text: str, output_type: str) -> dict:
#         """
#         Returns a dict:
#         {
#             "output_text": str,           # best translation
#             "confidence": float,          # 0-100
#             "alternatives": [             # all beams including the best
#                 {"text": str, "confidence": float},
#                 ...
#             ]
#         }
#         """
#         if output_type not in self.models or self.models[output_type] is None:
#             raise ValueError(f"Model for {output_type} not loaded")

#         logger.info(f"Transliterating: {text}")

#         try:
#             tokenizer = self.tokenizers[output_type]
#             model = self.models[output_type]

#             # Add task prefix for darija model (it was fine-tuned with this prefix)
#             if output_type == 'darija':
#                 input_text = 'transliterate arabizi to darija: ' + text
#             else:
#                 input_text = text

#             inputs = tokenizer(input_text, return_tensors="pt", padding=True)

#             with torch.no_grad():
#                 outputs = model.generate(
#                     **inputs,
#                     max_length=512,
#                     num_beams=5,
#                     num_return_sequences=3,       # Return top-3 beams
#                     output_scores=True,           # Needed for sequence_scores
#                     return_dict_in_generate=True, # Return a dict instead of bare tensor
#                     early_stopping=True
#                 )

#             # Decode all returned sequences
#             decoded = tokenizer.batch_decode(outputs.sequences, skip_special_tokens=True)

#             # outputs.sequences_scores is a tensor of shape (num_return_sequences,)
#             # containing the log-probability for each returned sequence
#             seq_scores = outputs.sequences_scores.tolist()

#             # Convert log-probs -> 0-100 confidence scores
#             confidences = self._compute_confidence(seq_scores)

#             # Build alternatives list (deduplicate in case beams produced identical text)
#             seen = set()
#             alternatives = []
#             for text_out, conf in zip(decoded, confidences):
#                 if text_out not in seen:
#                     seen.add(text_out)
#                     alternatives.append({"text": text_out, "confidence": conf})

#             # If somehow empty (shouldn't happen), fall back
#             if not alternatives:
#                 alternatives = [{"text": decoded[0] if decoded else "", "confidence": 50.0}]

#             result = {
#                 "output_text": alternatives[0]["text"],
#                 "confidence": alternatives[0]["confidence"],
#                 "alternatives": alternatives,
#             }

#             logger.info(f"Result: {result}")
#             return result

#         except Exception as e:
#             logger.error(f"Translation error: {e}")
#             raise Exception(f"Translation failed: {str(e)}")


# transliteration_service = TransliterationService()
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import logging
import torch
import os
import math

logger = logging.getLogger(__name__)


class TransliterationService:
    def __init__(self):
        self.models_config = {
            "darija": "./models/arabizi-to-darija",
            "msa": "./models/Zyadkh-arabizi-translator",
        }

        self.models = {}
        self.tokenizers = {}

        # Language-aware confidence calibration
        self.confidence_calibration = {
            "msa": {
                "min": 0.50,
                "scale": 1.0,
            },
            "darija": {
                "min": 0.65,   # Darija is inherently ambiguous
                "scale": 1.25, # Confidence stretching
            }
        }

        for name, path in self.models_config.items():
            self._load_model(name, path)

    # ----------------------------------------------------
    # MODEL LOADING
    # ----------------------------------------------------

    def _load_model(self, name: str, model_path: str):
        logger.info(f"Loading {name} model from {model_path}...")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}")

        self.tokenizers[name] = AutoTokenizer.from_pretrained(
            model_path,
            local_files_only=True,
            use_fast=False
        )

        self.models[name] = AutoModelForSeq2SeqLM.from_pretrained(
            model_path,
            local_files_only=True,
            torch_dtype=torch.float32
        )

        logger.info(f"✅ {name} model loaded successfully")

    # ----------------------------------------------------
    # CONFIDENCE CALCULATION (BEST PRACTICE)
    # ----------------------------------------------------

    def _token_level_confidence(self, token_scores):
        """
        Geometric mean of per-token probabilities
        Returns value in [0, 1]
        """
        log_probs = []

        for step_scores in token_scores:
            probs = torch.softmax(step_scores, dim=-1)
            top_prob = torch.max(probs).item()
            log_probs.append(math.log(max(top_prob, 1e-9)))

        avg_log_prob = sum(log_probs) / len(log_probs)
        return math.exp(avg_log_prob)

    def _entropy_confidence(self, sequence_scores):
        """
        Measures ambiguity across beams using entropy
        Returns value in [0, 1]
        """
        scores = torch.tensor(sequence_scores)
        probs = torch.softmax(scores, dim=0)

        entropy = -torch.sum(probs * torch.log(probs + 1e-9))
        max_entropy = math.log(len(probs))

        if max_entropy == 0:
            return 1.0

        return 1.0 - (entropy.item() / max_entropy)

    def _calibrate_confidence(self, raw_conf, output_type):
        """
        Language-aware calibration (returns [0, 1])
        """
        calib = self.confidence_calibration[output_type]
        adjusted = calib["min"] + (1 - calib["min"]) * (raw_conf ** (1 / calib["scale"]))
        return min(1.0, max(0.0, adjusted))

    # ----------------------------------------------------
    # TRANSLITERATION
    # ----------------------------------------------------

    def transliterate(self, text: str, output_type: str) -> dict:
        if output_type not in self.models:
            raise ValueError(f"Model '{output_type}' not loaded")

        tokenizer = self.tokenizers[output_type]
        model = self.models[output_type]

        if output_type == "darija":
            input_text = f"transliterate arabizi to darija: {text}"
        else:
            input_text = text

        inputs = tokenizer(input_text, return_tensors="pt")

        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_length=512,
                num_beams=5,
                num_return_sequences=3,
                output_scores=True,
                return_dict_in_generate=True,
                early_stopping=True
            )

        decoded = tokenizer.batch_decode(
            outputs.sequences,
            skip_special_tokens=True
        )

        sequence_scores = outputs.sequences_scores.tolist()

        # ------------------------------------------------
        # Raw confidence components
        # ------------------------------------------------

        token_conf = self._token_level_confidence(outputs.scores)
        entropy_conf = self._entropy_confidence(sequence_scores)

        raw_conf = 0.7 * token_conf + 0.3 * entropy_conf

        # ------------------------------------------------
        # Calibrated BEST confidence
        # ------------------------------------------------

        best_conf = self._calibrate_confidence(raw_conf, output_type)
        best_conf_pct = round(best_conf * 100, 1)

        # ------------------------------------------------
        # Calibrated alternatives confidence
        # ------------------------------------------------

        beam_probs = torch.softmax(torch.tensor(sequence_scores), dim=0)
        beam_probs = beam_probs / beam_probs.max()  # normalize relative to best

        alternatives = []
        seen = set()

        for text_out, rel_prob in zip(decoded, beam_probs):
            if text_out in seen:
                continue
            seen.add(text_out)

            # Apply SAME calibration to alternatives
            alt_raw_conf = raw_conf * rel_prob.item()
            alt_calibrated = self._calibrate_confidence(alt_raw_conf, output_type)

            # Ensure alternatives never exceed best
            alt_conf_pct = round(
                min(alt_calibrated, best_conf) * 100, 1
            )

            alternatives.append({
                "text": text_out,
                "confidence": alt_conf_pct
            })

        return {
            "output_text": alternatives[0]["text"],
            "confidence": best_conf_pct,
            "alternatives": alternatives
        }


# Singleton instance
transliteration_service = TransliterationService()
