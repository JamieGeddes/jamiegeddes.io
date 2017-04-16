---
title: Introducing Mountebank - a better way to mock your APIs (part 1)
date: 2017-02-06 22:39:05
tags: Mountebank, API, JSON
---

Imagine you're building a new client application, or you have a dependency on one or more services that are outwith your control. Rather than being tied to the actual implementations, or maybe even needing to wait until another team has finished building them, you really want to just stub out the dependencies in the same way as you would with a mocking framework when unit testing. When multiple teams are all working on different services in parallel, being able to validate that the piece of the puzzle  you're working on can talk to its dependencies is vital.

In the past, I've created simple stub services that simply return the data I want, replicating the interface that I'm expecting. These sort of projects tend to be throwaway, however, and it's easy to fall into the trap of just hardcoding the results you expect to receive. Ideally what you want is the simplest way of configuring behaviours so you can completely control the environment in which you're testing your code. This is where the mountebank mocking tool comes in...
<!-- more -->

## Introducing Mountebank... ![Mountebank logo](http://www.mbtest.org/images/mountebank.png)

[Mountebank](http://www.mbtest.org) is one solution to this problem, and one that I'll be covering in a series of upcoming posts. It's a NodeJS app, designed  to allow mock services to be spun up with the minimum of effort, allowing you to focus on your own code rather than worrying too much about external dependencies. Instead of hardcoding values, JSON can be used to define the behaviour of the mock service.

Assuming you've already downloaded and installed [NodeJS](https://nodejs.org), setting up Mountebank is easy. From a command prompt, enter the following:

~~~~
npm install -g mountebank
~~~~

Start it with the following command:

~~~~
mb
~~~~

By default, Mountebank runs on port 2525, so you can simply open your browser at [localhost:2525](localhost:2525) and view the (slightly quirky!) documentation. The [contracts page](http://localhost:2525/docs/api/contracts) in particular is worth a look, as it gives examples of some of the different features that are available.

The core concept behind Mountebank is *imposters*.  An imposter is simply a replacement for an actual implementation, in the same way as mocks are used in test driven development. An imposter can be used to mock multiple different endpoints, along with expected responses and can optionally add custom behaviour for more complex scenarios.

## A simple example

To demonstrate the basics, I'm going to mock a call to a real API, in this case one provided by [http://open-notify.org/](http://open-notify.org/) that lists the number of people currently in space, as documented [here](http://open-notify.org/Open-Notify-API/People-In-Space/)

At the time of writing, the data returned from this API endpoint is the following:

~~~~
{
    "people": [{
        "craft": "ISS",
        "name": "Sergey Rizhikov"
    }, {
        "craft": "ISS",
        "name": "Andrey Borisenko"
    }, {
        "craft": "ISS",
        "name": "Shane Kimbrough"
    }, {
        "craft": "ISS",
        "name": "Oleg Novitskiy"
    }, {
        "craft": "ISS",
        "name": "Thomas Pesquet"
    }, {
        "craft": "ISS",
        "name": "Peggy Whitson"
    }],
    "message": "success",
    "number": 6
}
~~~~

From this, we can see the interface that we're trying to mock, i.e. an array of objects containing the astronaut's name and spacecraft, a count of the number of astronauts currently in space, and a message indicating the success or otherwise of the request.

Let's start by creating a basic imposter to illustrate how we might mock a request to this endpoint. Using your favourite tool for crafting HTTP requests (I use [Fiddler](http://www.telerik.com/fiddler)), create a POST request to [localhost:2525/imposters](localhost:2525/imposters), adding a header of:

~~~~
content-type: application/json
~~~~

and with the following in the body of the request: 

~~~~
{
    "port": 4545,
    "protocol": "http",
    "name": "astronauts in space imposter",
    "stubs": [{
        "responses": [{
            "is": {
                "statusCode": 200,
                "body": {
                    "people": [{
                        "craft": "USS Enterprise",
                        "name": "James T Kirk"
                    }, {
                        "craft": "Nostromo",
                        "name": "Ripley"
                    }],
                    "message": "success",
                    "number": 2
                }
            }
        }]
    }]
}
~~~~

Note the body property of the stub contains the dummy response we want to return when the endpoint is called. The statusCode is the HTTP status code that you want to return - in this case we've set it to 200 (OK) to simulate a successful call to the endpoint.

Now send the POST request, and you should receive a status code of 201 indicating that the imposter has been created. If you now send a GET request to [localhost:2525/imposters](localhost:2525/imposters), you'll see the imposter has been created successfully. Alternatively, navigate to this URL in the browser and you'll see a basic UI for any imposters you have currently set up. 

Note that Mountebank itself listens for connections on port 2525, but your imposter listens on whatever port you specify - in the example above, we've set it to listen on port 4545. This can be reconfigured to any other free port (though most systems will restrict access to ports below 1024).

Now all you need to do is to send a GET request to the location of our imposter, [localhost:4545](localhost:4545). The response should contain the data we configured in the body property of the imposter we posted earlier:

~~~~
{
    "people": [{
        "craft": "USS Enterprise",
        "name": "James T Kirk"
    }, {
        "craft": "Nostromo",
        "name": "Ripley"
    }],
    "message": "success",
    "number": 2
}
~~~~

## Summary

In this post, I've shown how Mountebank can be used to create a simple mock for a real API, allowing us to control the behaviour of a service that might be outwith our control for the purposes of testing. In my next post, I'll cover how to generate a more complex imposter that will allow multiple different responses to be returned based on the request.

Note all of the samples for this series will be available from my Github repository here: [https://github.com/jamiegeddes/mountebank-samples](https://github.com/jamiegeddes/mountebank-samples)