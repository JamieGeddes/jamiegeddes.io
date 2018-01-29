---
title: Alexa Dev Day Edinburgh
date: 2018-01-29 22:02:43
tags: [Alexa, Amazon, AWS, Echo]
---

![Alexa Dev Day Edinburgh](/images/AlexaDevDayJan2018.png)

Last week I attended an Alexa Dev day in Edinburgh. I'd been to an introductory session last year, but this event promised to go into more depth and also cover some notable recent additions and enhancements.  The Alexa ecosystem is constantly evolving, and the tools and techniques used to build voice enabled skills are still in their infancy, so a hands-on session was just what I was looking for.
<!-- more -->

Some of the key highlights for me from the day's sessions:

* ### Emerging workflows for new video enabled devices
Although originally built as a voice-only device, the Echo family of products now includes devices with a screen. The recently released [Echo Spot](https://www.amazon.co.uk/Introducing-Amazon-Echo-Spot-Black/dp/B01J2BK6CO) allows information to be displayed in graphical form, in addition to the default voice responses. While the primary interaction method is still via voice, the addition of a screen offers new options, such as displaying more detailed "card" information relating to a request. Currently the information displayed is limited - there is no support for custom HTML for example, with only basic formatting available.

* ### A new tool for generating skeleton Lambda functions from an interaction model
[skillinator.io](https://skillinator.io/) is a tool that allows you to take the interaction model you build via the Alexa section of the Amazon Developer Console and create a skeleton Lambda function (in NodeJS) that you can simply copy and paste into the Lambda code editor. Each of the intents you have specified are registered with the Alexa handler library and each is translated into an empty Javascript functions that you can populate with your custom logic. This cuts out a lot of boilerplate setup, defining functions for each of your intents, and it's not hard to imagine this becoming fully integrated in the near future.

* ### Notifications
Until now, Alexa devices have always been driven completely by the user. Requests always originate from a user, there is no "push" functionality whereby unprompted changes can be sent by Amazon (or indeed any other allowed third party) to an Alexa device. However, an upcoming feature allows notifications to be sent to an Alexa device to be picked up by a user at a time that suits them. This will take the form of a visual indicator rather than anything that would be obtrusive to the user - it would not be desirable, for example, to raise an audible alert when a notification is received. The LED bar on the top of the Echo device will turn green to indicate that one or more notifications are pending, which the user can then choose to evaluate at a time that suits them.

* ### Reacting to a specific user's voice
An Alexa device will currently respond in the same way, regardless of who is interacting with it. In some cases, however, it might be beneficial to recognise individuals and handle requests differently, personalizing responses based on the user. For example, an Alexa device used in a household might produce different results when requested to play music. This feature is currently only available in a limited developer preview, but the benefits of this could be significant.

* ### Alexa Skills Kit Command Line Interface (ASK CLI)
In the age of the cloud, the majority of manual tasks can be replaced with simple automation. Up until recently, developing and deploying an Alexa skill has been very much a manual process, with different tasks performed either in the Developer Console or the AWS equivalent. AWS has long had a command line interface (CLI) that can be used to automate tasks, so the addition of a [new CLI for developing Alexa Skills](https://www.npmjs.com/package/ask-cli)) should eliminate a lot of manual effort and allow for greater repeatability. This is currently in beta, but will surely become the de facto standard for skill development in the future.


### Final thoughts
Although the attendance was surprisingly small, the day was well-run and I came away feeling I'd learnt a lot. It's clear to see that Amazon are constantly improving the Alexa ecosystem and making it easier than ever to develop for the platform. With competition from [Google's Home device](https://store.google.com/product/google_home), and [Apple's upcoming HomePod speaker](https://www.apple.com/uk/homepod/), it's clear that Amazon don't intend to give up their first mover advantage when it comes to voice enabled devices.