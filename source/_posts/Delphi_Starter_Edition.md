---
title: Delphi Starter Edition
date: 2017-04-14 23:23:32
tags: [Delphi, Development, OmniPascal, IDEs]
---

![Delphi Starter Edition Splash Screen](/images/DelphiStarterEditionSplash.png)

Delphi Starter Edition is Embarcadero's free version of the Delphi programming language and IDE, in the same vein as Microsoft's Community Edition of Visual Studio. I use the Professional edition of Delphi at work, so I was interested to see how the free version stacked up. I've been working on a side project recently in Delphi, so thought I'd give the Starter Edition a try.
<!-- more -->

Delphi's gradual decline in popularity over the years hasn't been helped by Embarcadero's wide ranging focus on seemingly everything other than the core language. Chasing the panacea of multi-platform development hasn't proved especially successful, and the latest foray into Linux development just seems like a step back to when [Kylix](https://en.wikipedia.org/wiki/Borland_Kylix) was the next big thing.

With that in mind, it's surprising that the free edition of Delphi, supposedly aimed at the individual developer or startup looking to build modern applications, is such a cut-down shadow of the full version. Yes, traditionally IDEs tended to come in fully featured (read expensive) editions, and a basic (very in some cases) imitation, but more recently Microsoft's release of Community edition versions of their Visual Studio IDE has changed this trend.

Delphi Starter Edition is listed on the [Embarcadero website](https://www.embarcadero.com/products/delphi/starter) as including a "streamlined" version of the IDE. If streamlined means they've removed much of the useful, and nowadays necessary functionality, that may be somewhat true. However, cutting out so many features like code completion, tooltip hints and even the most basic refactoring support seems incredibly short sighted. This feels like a deliberately limited version of Delphi. Instead of attracting would-be Delphi developers of the future, it's more likely to put off anyone picking it up hoping to do meaningful development.

One notable absence is any out-of-the-box support for unit testing. Where the Professional edition and above include source and integrated support for [DUnit](http://dunit.sourceforge.net/), with the Starter Edition you'll need to download the source yourself, or potentially opt for the more modern [DUnitX](https://github.com/VSoftTechnologies/DUnitX). The Delphi world has always seemed to lag behind everyone else when it comes to accepting the need for automated unit tests, so omitting even basic support seems a shame.

Given the licencing model is based around a yearly company revenue of less than $1000, it seems strange that Embarcadero would willingly back such a limited version. If they believe their language and IDE are good enough, they should have the confidence to do what Microsoft has done and entice more developers in by showing just how powerful their IDE can be.

A list of noteworthy omissions I've come across:

- No source code for the Visual Component Library (VCL).
- No support for building 64bit Windows applications.
- No refactoring support.
- No code formatting.
- Debug windows - no local variables window. This means you'll need to trace through the calling methods in order to look at state, instead of setting a breakpoint then jumping back up the call stack and inspecting state.
- Removal of the recently added TRESTClient and associated components. If you want to use webservices, you'll need to use the much lower-level abstraction Indy components (which thankfully are included in the Starter edition), or find a 3rd party component to use instead.
- Ctrl+click to navigate no longer works.
- Hover hints while debugging are no longer present - you need to either right click and select Debug->Evaluate/Modify or add a watch.

With the ubiquity of Visual Studio, and other free IDEs like IntelliJ Community, Embarcadero really need to be doing a lot more to make Delphi Starter Edition a viable platform for anyone looking to get started. With new viable alternatives like the promising [OmniPascal](http://www.omnipascal.com/) project to allow Delphi development using Visual Studio Code, I certainly won't be rushing to use Delphi Starter Edition again.