# Introduction
Janko (Janko.js) is a framework for building efficient, scalable [Telegram Bot](https://core.telegram.org/bots/api) applications. It uses [Typescript](http://www.typescriptlang.org/) and combines best practices from OOP (Object Oriented Programming) and FP (Functional Programming).

Under the hood, Janko makes use of [Node.js Telegram Bot API](https://github.com/yagop/node-telegram-bot-api) library.

Janko provides a level of abstraction above this common Telegram Bot API library, but also expose it's api directly to the developer. This gives developers awesome flexibility and the feedom in using all it's possibilities.

# Philosophy
In recent years, thanks to Node.js, JavaScript has become a universal language that is using for both front and backend applications. This has given rise to awesome projects like [Angular](https://angular.io/), [React](https://github.com/facebook/react) and [NestJS](https://docs.nestjs.com/), which improve developer productivity and enable the creation of fast, testable and extensible frontend applications. However, NestJS exists for Node (server-side JavaScript) and successfully solves an **Architecture** problems for common web applications, but it doesn't provide an opportunity to make applications based on **polling** like Telegram Bots.

Janko provides an out-of-the-box Telegram Bot application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. The architecture is heavily inspired by NestJS and Express.

# Installation
To get started, you need to initialize your application with npm, yarn or any other package manager and install the main Janko package using the following command:

```
npm i janko
```

That's it! Now you are ready to make your [first steps](overview/FIRST_STEPS.md) with Janko.
