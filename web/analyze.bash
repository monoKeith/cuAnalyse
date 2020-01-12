#!/bin/bash
export PATH=/opt/miniconda3/bin:$PATH
export GOOGLE_APPLICATION_CREDENTIALS="../key.json"
source activate cuhacking
python3 ./sentiment_analysis.py -fn test500.json