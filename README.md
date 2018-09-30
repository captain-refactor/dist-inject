# Dist-inject
[![codecov](https://codecov.io/gh/janexpando/dist-inject/branch/master/graph/badge.svg)](https://codecov.io/gh/janexpando/dist-inject)
[![CircleCI](https://circleci.com/gh/janexpando/dist-inject/tree/master.svg?style=svg)](https://circleci.com/gh/janexpando/dist-inject/tree/master)

A powerful and lightweight inversion of control container for JavaScript & Node.js apps with zero dependencies.

## About
An IoC container uses a class constructor to identify and inject its dependencies.

## Motivation
As an Object Oriented developer, that uses SOLID principles, it is hard to do work in bigger project in mostly "Javascript style" oriented developers. 
This library helps you write your code and also helps them to use your code without much hassle.


## Why dist-inject
 - It is lazy. Resources are loaded, when needed.
 - Increase code reausability
 - Usable without reflect-metadata package. It is needed only, when you use injectable decorator.
 - Cross platform
 - Usable in js projects