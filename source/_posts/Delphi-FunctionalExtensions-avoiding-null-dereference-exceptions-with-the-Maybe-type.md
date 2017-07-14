---
title: >-
  Delphi.FunctionalExtensions - avoiding null dereference exceptions with the
  Maybe type
date: 2017-07-14 21:57:30
tags: Delphi
---

Null dereference exceptions are a trap awaiting the unwary developer. Careless use of object references can result in unhandled exceptions, security vulnerabilities and unhappy users! From the [OWASP description](https://www.owasp.org/index.php/Null_Dereference):

> Null pointer errors are usually the result of one or more programmer assumptions being violated. Most null pointer issues result in general software reliability problems, but if an attacker can intentionally trigger a null pointer dereference, the attacker might be able to use the resulting exception to bypass security logic or to cause the application to reveal debugging information that will be valuable in planning subsequent attacks.

> A null-pointer dereference takes place when a pointer with a value of NULL is used as though it pointed to a valid memory area.

In this post, I'll describe how to mitigate against the risk of null deference exceptions in Delphi code, using a concept borrowed from the world of functional programming.
<!-- more -->

## An example...

Given the following interface, what would you expect the *GetById* method to return?

````pascal
type IWidgetRepository=interface

  function GetById(id: Integer): TWidget;
end;
````

If your answer was "an instance of TWidget" then you'd only be half right. In fact, based on the actual implementations of the IWidgetRepository interface, it's possible that it could return Nil.  All code that calls *GetById* needs to check the return value is assigned before using it, otherwise you'll get the dreaded null dereference exception. It's easy to be caught out by this, and the method signature doesn't really help here; the return type *implies* that you'll get a TWidget instance, but it doesn't *guarantee* that it can't be Nil.

One of the principles of functional programming is method signature honesty. Is there a better way to implement the method to identify that the return value may be *either* an instance of TWidget or unassigned?

## Introducing the Maybe type

The **Maybe** type can be used to explicitly indicate that a method returns *either* a specified type *or* an unassigned reference. Instead of relying on the caller to check for assignment of the reference, accessing the returned value must be done through an explicit unwrap operation. This prevents calling code accidentally missing an assignment check and triggering a null dereference exception.

The Maybe type can be implemented as a generic type, allowing it to be used with any reference type. Note that it doesn't make sense to use the Maybe type with value types, as a value type can't be unassigned in the same way an object reference can. Therefore the type constraint must enforce that the generic type T is a class. The Maybe type itself is declared as a record rather than a class, allowing us to use it without having to manage the object lifetime of the Maybe instance (which is intended to be a wrapper around the actual object reference we care about).

An instance of the record needs to store the value of type T, so this is defined via a readonly property. This all gives us the basic outline definition of the Maybe type as:

````pascal
type Maybe<T: class> = record
  private
    _value: T;

    function GetValue: T;

  public
    function HasValue: Boolean;

    property Value: T read GetValue;
end;

...

function Maybe<T>.HasValue: Boolean;
begin
  Result := Assigned(_value);
end;

function Maybe<T>>GetValue: T;
begin
  Result := _value;
end;
````

The HasValue function can be used to determine that we have an assigned value, but how do we set the underlying value in the first place? The answer is by doing an *implicit* type conversion, by adding the following:

````pascal
class operator Maybe<T>.Implicit(value: T): Maybe<T>;
begin
  Result := Maybe<T>.Create(value);
end;

constructor Maybe<T>.Create(value: T);
begin
  _value := value;
end;
````

Note the constructor can be defined with private scope, as you won't normally create an instance of the Maybe type directly. If that sounds strange, consider the following implementation of our original widget repository method:

````pascal
function TWidgetRepositoryGetById(id: Integer): TWidget;
var
  widget: TWidget;
begin
  for widget in widgets do
  begin
    if widget.id = id then
    begin
      Result := widget;
      Break;
  end;

  Result := Nil;
end;
````

and the calling code:

````pascal
procedure TWidgetService.UpdateWidgetPrice(id: Integer; newPrice: Currency);
var
  widget: TWidget;
begin
  widget := widgetRepository.GetById(id);

  widget.price := newPrice; // Possible Nil reference exception here if widget cannot be found
end;
````

All we need to do to the repository code is to change the return type of the method as follows:

````pascal
function TWidgetRepositoryGetById(id: Integer): Maybe<TWidget>;
var
  widget: TWidget;
begin
  for widget in widgets do
  begin
    if widget.id = id then
    begin
      Result := widget;
      Break;
  end;

  Result := Nil;
end;
````

Note all we've done is to change the return type of the method; the implicit assignment operator we defined earlier handles the conversion from our underlying type, TWidget, to the Maybe<TWidget> wrapper representation.

Now we can update our calling code to use the Maybe type:

````pascal
procedure TWidgetService.UpdateWidgetPrice(id: Integer; newPrice: Currency);
var
  widgetOrNothing: Maybe<TWidget>;
  widget: TWidget;
begin
  widgetOrNothing := widgetRepository.GetById(id);

  if(widgetOrNothing.HasValue) then
  begin
    widget := widgetOrNothing.Value;
    widget.price := newPrice;
  end;
end;
````

Now we're using the HasValue method to explicitly check that we have a widget to work with, whereas previously we may have forgetten the assignment check and run the risk of dereferencing a Nil reference. Because we're now forced to unwrap the value explicitly, we've eliminated the potential to try and work with the Nil widget reference. Additionally, I've renamed the variable for the object returned from the call to the repository method, to indicate that the underlying value is not always assigned.

## Summary

In this post I've described how to use the Maybe type to indicate that a given method may return an object reference *or* a null reference. Using the Maybe type prevents missed assignment checks in calling code, improving the reliability and resilience of your code. It also helps improve the honesty of your method signatures, as it indicates more clearly to the reader the actual return type of the method.

Note this blog post and the accompanying code were inspired by [Vladimir Khorikov](http://enterprisecraftsmanship.com/)'s excellent [CSharpFunctionalExtensions library](https://github.com/vkhorikov/CSharpFunctionalExtensions) which I've been using extensively recently on C# projects. The code above is a Delphi port of this code, and is available from my [Github repository](https://github.com/JamieGeddes/Delphi.FunctionalExtensions).