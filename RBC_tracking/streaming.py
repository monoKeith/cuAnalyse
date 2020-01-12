import tweepy
import json
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener

consumer_key = 'Fi8UY5UtgvSm5pw5Gzyz29ZLE'
consumer_secret = '9H8mFPrWlbFfwqXyoSIHierQY6VfVckw3c1c5BKACGyhBqVO2g'
access_token = '1216047470033149952-KmHP7X2LhqDwWleYUZNMFcjLdpxwjg'
access_secret = 'atAA8KaQFjRk4sPEOtCiIyWpouoiLANd2BLQNvA090o9D'

auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_secret)

api = tweepy.API(auth)


class MyListener(StreamListener):

    def on_data(self, data):
        try:
            # temp = str(data)
            js = json.loads(data)
            print(js["text"])
            tempData = {
                "fulltext": js["text"],
                "time": js["created_at"],
                "image": js["user"]["profile_image_url"]
            }
            tempObj.append(tempData)
            # with open('test.json', 'a') as f:
            with open('test.json', 'w+') as f:
                #f.write(json.dumps(tempdata))
                # f.write(',')
                f.write(json.dumps(tempObj))
                return True

        except BaseException as e:
            print("Error on_data: %s" % str(e))
        return True

    def on_error(self, status):
        print(status)
        return True


# fo = open('test.json', 'w+')
tempObj = []
twitter_stream = Stream(auth, MyListener())
# twitter_stream.filter(track=['#123456789cuhacking'])
twitter_stream.filter(track=['suck'], languages=['en'])
