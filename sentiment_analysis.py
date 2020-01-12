from google.cloud import language_v1
from google.cloud.language_v1 import enums
import spacy
import en_core_web_sm
import json
import time
import argparse

def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("-kw", "--keywords", type=str, default="", help="Key words string. Saparated by #.")
    ap.add_argument("-fn", "--filename", type=str, default="RBC.json", help="Name of Json file that contains tweets.")
    args = ap.parse_args()
    return args

def parse_jason(file_name):
    with open(file_name) as jf:
        data = json.load(jf)
    doc_list=[]
    for i in data:
        doc_list.append(i["fulltext"])
    return doc_list
        
def sample_analyze_sentiment(text_content):
    """
    Analyzing Sentiment in a String

    Args:
      text_content The text content to analyze
    """

    client = language_v1.LanguageServiceClient()

    type_ = enums.Document.Type.PLAIN_TEXT

    document = {"content": text_content, "type": type_, "language": "en"}

    # Available values: NONE, UTF8, UTF16, UTF32
    encoding_type = enums.EncodingType.UTF8

    response = client.analyze_sentiment(document, encoding_type=encoding_type)

    return response.document_sentiment.score


def entity_sentiment_analysis(text_content):
    client = language_v1.LanguageServiceClient()
    type_ = enums.Document.Type.PLAIN_TEXT
    language = "en"
    document = {"content": text_content, "type": type_, "language": language}
    encoding_type = enums.EncodingType.UTF8
    response = client.analyze_entity_sentiment(document, encoding_type=encoding_type)
    entities = response.entities
    for i in range(len(entities)):
        print(entities[i].name)

def check_key_words(text, key_words):
    nlp = en_core_web_sm.load()
    tokens = nlp(text)
    for token in tokens:
        if token.text in key_words:
            return True
    return False
    
def contain_key_words(text,key_words):
    for w in key_words:
        if w in text:
            return True
    return False

def main():
    args = parse_args()
    json_file = args.filename
    tweets_list = parse_jason(json_file)
    #key_words_list = ['server','app','website','web','online','application','site','network','service']
    count = 0
    total = len(tweets_list)
    print("Total number of tweets: {}".format(total))
    with open('out.txt','w') as f: 
        if args.keywords != "":
            key_words_list = args.keywords.split("#")
            #print(key_words_list)
            #import pdb;pdb.set_trace()
            for tweet in tweets_list:
                sent_score = sample_analyze_sentiment(tweet)
                if sent_score < 0.0 and contain_key_words(tweet,key_words_list):
                    count += 1
                    print(tweet)
                    f.write(tweet+'\n')
        else:
            for tweet in tweets_list:
                sent_score = sample_analyze_sentiment(tweet)
                if sent_score < 0.0:
                    count += 1
                    print(tweet)
                    f.write(tweet+'\n')
                
        print('Percentage of negtive tweets: {}%'.format(format(count/total*100,'.1f')))
        f.write('Percentage of negtive tweets: {}%\n'.format(format(count/total*100,'.1f')))
start = time.time()
main()
end = time.time()
print("Time elapsed: {} secs".format(format(end-start,'.1f')))