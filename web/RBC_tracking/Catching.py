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


# max_tweets = 3
# searched_tweets = []
# last_id = -1
#
# while len(searched_tweets) < max_tweets:
#     count = max_tweets - len(searched_tweets)
#     try:
#         new_tweets = api.search(q=['suck'], count=count, max_id=str(last_id - 1))
#         if not new_tweets:
#             break
#         searched_tweets.extend(new_tweets)
#         last_id = new_tweets[-1].id
#     except tweepy.TweepError as e:
#         # depending on TweepError.code, one may want to retry or wait
#         # to keep things simple, we will give up on an error
#         break

searched_tweets = tweepy.Cursor(api.search, q = "RBC -filter:retweets", lang="en").items(100)

tempObj = []
for tweet in searched_tweets:
    tempData = {
        "fulltext": tweet.text,
        "time": str(tweet.created_at),
        "image": tweet.user.profile_image_url
    }
    tempObj.append(tempData)


print(str(tempObj))
fo = open('testCatching.json', 'w+')
fo.write(json.dumps(tempObj))



#
# fo = open('testCatching.json', 'w+')
# tempObj = []
# for tweet in searched_tweets:
#     tempData = {
#         "fulltext": tweet["text"],
#         "time": tweet["created_at"],
#         "image": tweet["user"]["profile_image_url"]
#     }
#     tempObj.append(tempData)
# fo = open('testCatching.json', 'w+')
# fo.write(json.dumps(tempObj))



# tweets = tweepy.Cursor(api.search, q = ['suck'], lang="en").items(5)
