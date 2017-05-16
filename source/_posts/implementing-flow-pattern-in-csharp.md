---
title: Implementing the flow chart pattern in C#
date: 2017-05-07 22:45:44
tags:
---

A few years ago, I needed to extend some existing code that was performing a series of steps in a process. The particular example was an implementation of a save process for a desktop application, where changes made by the current user potentially needed to be re-evaluated against the latest state of the data in a shared repository (analogous to commits to a version control system) and rebased if necessary. The process involved many steps, and was liable to change as requirements changed over time.

While evaluating the previous code, my natural inclination was to draw out the current implementation as a flow chart. I tend to think visually, so being able to see the logic mapped out like this made it much easier to visualise the different parts of the code and the execution paths.

The overall process had many parts to it, and I knew that additional steps would be required as I added extra functionality. As the requirements weren't well defined, I wanted to build something that could easily be extended and tweaked without reworking the entire design. The cleanest solution seemed to be to map the flow chart into a set of executable steps. At the time, I didn't find any design pattern that described the problem I was trying to address. State machines were the closest I could find, however, in my case each state wasn't just a static entity with no behaviour, instead each step needed to perform particular actions that would then dictate the path followed through the flow chart.

## Executable steps
The design I came up with was to model each box in the flow chart as an executable step, containing just the logic for that one piece of functionality. Steps could either be *action* steps, which simply executed some logic and moved onto the next step in the flow, or *conditional* steps where a specified condition would be evaluated to determine which path to follow next. The context of the overall operation, i.e. the data that was common to the entire process was passed between each step in the flow.

In order to join up the flow, steps would require to be wired up in the correct order. Action steps only required to be given the code to be executed and the next step to execute afterwards. Conditional steps, however, required not only the definition of the boolean condition to be evaluated, but also the positive and negative steps that would be executed based on the result of evaluating the condition.

This was all intended to be as generic and extendable as possible. One initial approach was to pass the next step to the constructor of the task step, and the positive and negative steps to the constructor of the conditional step. However, this required the flow to be created in reverse order, as you'd need to create the later steps to inject them into the earlier ones. Conceptually this made it more difficult to setup, and also less flexible if you ever wanted to change the ordering of steps, or to redesign part of the overall process.

The solution I came up with was to define a base interface for all steps:

````csharp
    public interface IExecutableStep<T>
    {
        void Execute(T context);
    }
```` 

This could then be extended with an interface for the action step:

````csharp
    public interface IActionStep<T> : IExecutableStep<T>
    {
        IExecutableStep<T> NextStep { get; set; }
    }
````

and one for the conditional step:

````csharp
    public interface IConditionalStep<T> : IExecutableStep<T>
    {
        IExecutableStep<T> PositiveStep { get; set; }
        IExecutableStep<T> NegativeStep { get; set; }
    }
````

Note in both cases, the successive steps are defined as the base type, to allow either an action or a conditional step to be used, depending on the implementation of your flow chart. I've also used generics throughout, as the actual context object passed throughout the process is specific to whatever process you're defining, and shouldn't need to be tied to a specific implementation.


## Action step implementation

For action steps, the code you want to execute as part of the step needs to conform to the following interface:

````csharp
    public interface IExecutableAction<T>
    {
        void Execute(T context);
    }
````

In practice, what I ended up doing was to create a simple adapter classe that implemented this interface and simply called onto the code from the previous implementation. This worked nicely and meant much of the previous code could be reused.

The code for the action step was defined as:

````csharp
    public class ActionStep<T> : IActionStep<T>
    {
        private readonly IExecutableAction<T> action;

        public ActionStep(IExecutableAction<T> action)
        {
            this.action = action;
        }

        public void Execute(T context)
        {
            action.Execute(context);

            NextStep?.Execute(context);
        }

        public IExecutableStep<T> NextStep { get; set; }
    }
````

The action step simply calls the action that has been passed to its constructor before calling onto the next step in the process, if it has been assigned.

## Conditional step implementation

The conditional step works in a similar way:

````csharp
    using System;

    public class ConditionalStep<T> : IConditionalStep<T>
    {
        private readonly ICondition<T> condition;

        public ConditionalStep(ICondition<T> condition)
        {
            this.condition = condition;
        }

        public void Execute(T context)
        {
            if(condition.Evaluate(context))
            {
                if (PositiveStep == null) throw new Exception("PositiveStep is not assigned");
                PositiveStep.Execute(context);
            }
            else
            {
                if (NegativeStep == null) throw new Exception("NegativeStep is not assigned");
                NegativeStep.Execute(context);
            }
        }

        public IExecutableStep<T> PositiveStep { get; set; }
        public IExecutableStep<T> NegativeStep { get; set; }
    }
````

The condition to evaluate is defined as:

````csharp
    public interface ICondition<T>
    {
        bool Evaluate(T context);
    }
````

The conditional step will call PositiveStep if the condition evaluates to true, or NegativeStep if false. Note that an exception is raised if either the positive or negative steps has not been assigned. Whereas an action step can be the last step in the overall process, it doesn't make sense for a conditional step to be the final step.

## Flow execution

As the first step is chained to the next step(s) in the process, executing the overall flow is a simple case of calling the execution of the first step.

````csharp
    using System.Collections.Generic;

    public class ExecutionFlow<T>
    {
        private readonly ICollection<IExecutableStep<T> steps;

        public ExecutionFlow()
        {
            steps = new Dictionary<string, IExecutableStep<T>>();
        }

        public void RegisterStep(string stepName, IExecutableStep<T> step)
        {
            steps.Add(stepName, step);
        }

        public void Execute(T context)
        {
            FirstStep.Execute(context);
        }

        public IExecutableStep<T> FirstStep { get; set; }
    }
`````


## Building the flow

In order to execute the flow, an implementation of the context is required. This should ideally be a simple value object, with the data that is required throughout the overall process. In my case, the context had a reference to the changes made by the user in the current session, and the identifier of the data to be updated.