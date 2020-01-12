import json
import requests
import tweepy
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

