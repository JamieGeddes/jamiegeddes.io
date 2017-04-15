---
title: Introducing Mountebank (part 2) - responses and predicates
date: 2017-04-10 22:53:01
tags: Mountebank, API, JSON
---

In the previous post, I introduced Mountebank as a way of mocking calls to services. A simple example of how to mock out a call to a real service was demonstrated, returning a dummy set of data for every call to the service endpoint. However, this example would always return the same set of data, which limits its usefulness somewhat!

In this post, I'll show how to add some conditional behaviour to imposters, allowing you to configure the responses based on the requests you make.

## Responses

The most basic example is to return a series of canned responses for repeated calls to the same endpoint. Mountebank can be set up to return a set of responses, where each response is called in round-robin fashion. Calling the same endpoint multiple times just cycles through all of the responses you've pre-configured, looping back around to the first one when it gets to the end of the array.

For example:

````json
{
  "port": 4545,
  "protocol": "http",
  "stubs": [
    {
      "responses": [
        {
          "is": {
             "statusCode": 201,
             "body": {"result": "created"}
          }
        },
        {
          "is": {
              "statusCode": 200,
              "body": {"result": "exists"}
          }
        }
      ]
    }
  ]
}
````

In this example, we've configured a couple of responses. On the first call to our stub, the 201 response will be returned.  Calling it again will return the 200 response.  At this point the next response will be set back to the start of the array of responses, so in this case it would just return  the 201 response again.

This type of response is useful when you just want to setup a series of canned responses, but the real power of mountebank only comes when you start to introduce conditional behaviour.

## Stub predicates

[Stub predicates](http://www.mbtest.org/docs/api/predicates) allow you to specify selection criteria for stubs, giving you the ability to conditionally define the responses you return.  Predicates support everything from the most simple match through to injecting your own Javascript code for more complex matching scenarios.

The example below shows the use of predicates to match a particular request path:

 ````json
 {
  "port": 4545,
  "protocol": "http",
  "stubs": [{
    "predicates": [{
      "equals": {
        "method": "POST",
        "path": "/products/1"
      }
    }],
    "responses": [{
      "is": {
        "statusCode": 201,
        "headers": {
          "Location": "http://localhost:4545/products/1",
          "Content-Type": "application/json"
        },
        "body": {
          "productId": 1
        }
      }
    }, {
      "is": {
        "statusCode": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "errorMsg": "Product has already been added"
        }
      }
    }]
  }, {
    "predicates": [{
      "equals": {
        "method": "GET",
        "path": "/products/1"
      }
    }],
    "responses": [{
      "is": {
        "statusCode": 200,
        "body": {
          "productId": 12345,
          "name": "widget",
          "manufacturer": "Acme products"
        }
      }
    }]
  }, {
    "responses": [{
      "is": {
        "statusCode": 404
      }
    }]
  }]
}
````

Performing a POST to /products/1 results in a status code of 201, to simulate the resource having been created. A subsequent POST to this same endpoint returns a status code of 200, indicating that the resource already exists. If a GET request is then made to the same endpoint, the predicate for the first stub no longer matches the specified method of the first stub, so the next stub is checked for a match. In this case, the GET method matches the expected method of the second stub, as does the path, therefore the (single) response from the second stub is returned.

If a GET or POST request is made to /products/2, the final stub will be used, which simply returns a response of 404 to indicate that the resource cannot be found.

It's important to note that the first matching predicate will cause the stub it's in to be selected. If no matching stubs are found, the default response will be returned (200: OK unless you've explicitly configured the default response property of the imposter yourself). You can have multiple predicates within a stub, but the selection of the stub will then be determined by the combination of all of the stubs ANDed together.

It's worth pointing out that you only need multiple stubs in an imposter if you're using predicates, as a stub will always match in the absence of a predicate. 

## Summary
In this post, I've demonstrated how easy it is to setup a series of canned responses. When combined with stub predicates, this allows you to tailor responses for each particular scenario you wish to cover. I've found in practice that canned responses and stub predicates cover the main functionality that's required for the majority of simple APIs. Stub predicates offer many different options for specifying matching criteria, including request path, header and body parameters but in most cases, the equals predicate will offer everything you need.