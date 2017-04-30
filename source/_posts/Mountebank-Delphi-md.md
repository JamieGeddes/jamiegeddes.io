---
title: Mountebank-Delphi Client Library Initial Release
date: 2017-04-18 22:46:25
tags: Mountebank, Delphi, Development
---

I'm happy to announce the first release of the [mountebank-delphi](https://github.com/JamieGeddes/mountebank-delphi) project I've been working on recently. It's a Delphi client library for use with the [mountebank](http://www.mbtest.org) tool, and simplifies the use of mountebank in a Delphi environment. For anyone unfamiliar with mountebank, it's a wonderfully simple tool for mocking out service dependencies.

The main use case for this library is when setting up mock services for integration tests in Delphi. Via a simple fluent interface, you can define the expected responses from your mocked servicea, rather than having to remember the exact steps required to configure mountebank. Although this is an initial release of the library, it supports the main features you'll want to use in your integration tests, namely responses and stub predicates.
<!-- more -->

Instead of connecting to an actual service, you simply change your application's settings (or the particular sub-section of code you're interested in) to substitute the actual URL for the mock one. In practice, this would normally consist of swapping the call from http://yourdomain/serviceendpoint to http://localhost:5555/serviceendpoint, where 5555 is the port you want to use locally. Of course, if you've defined the host and protocol separately from the endpoint's route, you'll only need to substitute the host segment of the URL.

## Setup

The library can be downloaded from my [Github repository](https://github.com/JamieGeddes/mountebank-delphi) and saved locally. You can either add a path to the downloaded location to your Library Path if you want to make it available to any Delphi apps you write or add the path to the project options. For non project-specific dependencies, I would always recommend adding the mountebank-delphi path to your library path.

Once this is done, you can instantiate an instance of the mountebank client by adding a reference to Mb.Client in your uses clause, and setting up as follows:

````pascal
uses Mb.Client;
...
var mbClient: IMbClient;
begin
  mbClient := NewMbClient;

  mbClient.Start;
````

The NewMbClient function is used to create a new instance of the client, and wires up all of the dependencies it requires. The client can then be started with the Start method. By default, this will start mountebank on the default port of 2525. However if you want to run it on a different port, or with non-standard options, the following can be used:

````pascal
  mbClient.StartupOptions
    .AllowInjection
    .RunOnPort(9000)
    .LogToFile(''C:\Temp\mountebank logs')
    .AllowMockVerification;

  mbClient.StartWithOptions;
````

Note there are a number of configurable options supporting the majority of mountebank's command line arguments.

## Adding an imposter

Imposters can be setup using the following syntax:

````pascal
uses Mb.HttpImposter;
...
  var imposter: TMbHttpImposter;
...
  imposter := mbClient.CreateHttpImposter
                .WithName('testImposter1')
				.ListenOnPort(6789);
````

Here we've setup a new imposter with a name of testImposter1 that will listen for requests made on port 6789. In this example the imposter has been created as an Http imposter, but the Https imposter type is also supported. It's important to note that this will simply setup the imposter in memory, it will not be posted to mountebank until you explicitly request it. The reason for this is to allow you to continue customizing the behaviour of the imposter. As mountebank does not allow inplace modification of existing imposters, any customization must be done prior to submitting it.

## Configuring expected responses

Currently mountebank-delphi offers support for canned responses and stub predicates. Canned responses can be setup by adding one or more responses to a new stub.

````pascal
uses Mb.Constants;
....
  imposter
    .AddStub
      .AddResponse
        .WillReturn(HttpStatusCode.OK)
        .WithBody('{"name": "fred"}');
````

Alternatively, the superobject library can be used to create an object whose serialized representation can be returned as the body of the response:

````pascal
uses superobject;
...
var body: ISuperObject;
...
body := TSuperObject.Create();
body.S['name'] := 'fred';

imposter
  .AddStub
    .AddResponse
      .WillReturn(HttpStatusCode.OK)
      .WithBody(body);
````

## Submitting the imposter

The fully populated imposter can now be posted to mountebank with the following command:

````pascal
  mbClient.SubmitImposter(imposter);
````

At this point the imposter is fully configured and ready to be used. It can also be verified by opening a browser, navigating to localhost:2525 (assuming mountebank is running on the default port) and examining the responses page.

## Stopping the client

Finally, once you've finished executing your code, or in your test case teardown, the mountebank client can be stopped by calling

````pascal
mbClient.Stop();
````

## Next steps
I'm planning on building out the rest of the Mountebank functionality over time. Support for all of the different predicate types is next on the list to look at! If anyone has any ideas on implementation then I'd be delighted to accept pull requests.

## Summary

In this post I've covered how to setup a simple canned response with the mountebank-delphi client library. I'm happy to receive pull requests for any additional functionality you might want to add, and would be interested to hear how this library is used.