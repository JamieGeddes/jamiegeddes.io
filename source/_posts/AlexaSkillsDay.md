---
title: Alexa Skills Day
date: 2017-07-20 22:32:20
tags: [Alexa, Amazon, AWS, Echo]
---

Today I've been at an Amazon Alexa Skills Day in Glasgow. Having owned an Echo for a few months now, I've dabbled with creating Alexa apps, or skills to use the Amazon terminology, so when I saw this event advertised I was keen to attend. Presented by [David Low](https://twitter.com/daviddlow), Principal Evangelist for Alexa in the EU, the event started with an overview of the Alexa ecosystem, and how successful Amazon has been in introducing its voice controlled speaker Echo over the past few years. Apparently the Echo has become such an important part of everyday life for some people that Amazon has recorded upwards of 250,000 marriage proposals to Alexa...
<!-- more -->

## Alexa overview

Although Alexa provides a conduit into Amazon's own retail environment, it also offers the ability for 3rd parties to develop their own apps for the platform, referred to as Alexa skills. A skill is a voice interaction app, from the simplest question and response style through to a full blown conversational interface. Today's session covered the basics of how to build and publish a skill, using the building blocks provided by Amazon. One of the nice things about Amazon's offerings is the myriad of ways to combine their different services together, combining some of the foundational services such as compute and storage in order to build new applications.

The key concepts to understand before building a skill, namely *invocation commands*, *intents* and *utterances* were discussed next. An *invocation command* is how you tell Alexa to launch your skill, for example "Alexa, open the Guardian", or "Alexa, ask the Guardian to give me the headlines". Invocation names need to be valid words from the English dictionary, and there are [restrictions on what you can use](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/choosing-the-invocation-name-for-an-alexa-skill#invocation-name-requirements).

A skill doesn't need to have a unique name, but a user can't install more than one skill with the same name. The thorny issue of trademark infringement was touched upon; while Amazon might not stop you using a skill with another company's name or trademark, you'd still be liable if they choose to complain.

*Intents* define the actions that are available to a user, i.e. for each request made to your skill, you want to identify the intent of the user and map it to the relevant logic to produce a suitable response. An intent is a singular function (and indeed maps to a single programmatic function in the code), but the way the user accesses them is via *utterances*, which are simply the different ways in which a user can phrase a request. For example, a user may say "tell me a random fact", or "give me a random fact". Ideally you want to be able to support as many variations in order to make it a better experience for the user, who can't be expected to know exactly the format you're expecting to hear the request.

## Developing an Alexa skill

An overview of the practical steps of creating an Alexa skill came next, highlighting the ease with which a skill can be created, using the tools that Amazon give you. With valid AWS and Amazon Developer accounts, you create the different features you need for your skill and assemble them together into the skill that you'll provide to your users. From the basic off-the-shelf facts skill template, we created a simple skill for returning a random fact from a pre-defined list. The majority of the effort setting up the skill lies in configuration, the heavy lifting (such that there is) is done via [AWS Lambda](https://aws.amazon.com/lambda/), Amazon's serverless framework. Lambda allows you to deploy code without having to worry about the underlying infrastructure. I've used it previously to create simple HTTP services, although these were always accessed via the AWS API Gateway. For an Alexa skill, you simply define the skill as the initial source of the trigger, connecting the skill to the Lambda function that implements your custom logic.

Testing of your newly developed skill can be done via the [echosim.io](https://echosim.io/) testing tool. Used in conjunction with Google Chrome, you can connect via your Amazon account to try out your skill, including using your computer's microphone to simulate a real Echo device.

The afternoon session covered some more advanced examples, showcasing the code samples from the [Alexa cookbook Github repository](https://github.com/alexa/alexa-cookbook/tree/master/labs/Day-1). Topics such as using slots to identify key elements of input data, calling external APIs, setting and persisting session attributes were covered, helping to flesh out some of the basics from the morning session. 

## Don't forget the user!

Next was a reminder of perhaps the most important consideration for developers looking to build Alexa skills - don't forget the human element! Creating and testing a skill in isolation is likely to result in a brittle and difficult user experience. David introduced a seemingly simple scenario of ordering a coffee from Starbucks, and how the user experience could be ruined by an inflexible design. Hint, think like a user and not a robot! 

## Final steps

Once you've verified that your skill can handle everything a user can throw at it, you'll want to publish it for certification. Assuming no corrections are required, your skill is then available to the general public via the Alexa skills store on the Amazon website, or via the Alexa app.

## Summary

I found today's event very useful in explaining the different parts of the system, and how an Alexa skill can be built to satisfy how a user might want to use it. The examples were perfect for walking through the steps required to add more complex functionality, to the point where I feel I now have a good understanding of what it takes to build a skill, and am inspired to put what I learnt into practice. Now I just need to submit my Alexa skill before the end of the month to qualify for my free Echo Dot :)