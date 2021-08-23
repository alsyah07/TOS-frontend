### Installation

##### 1. Install NodeJS

Install node JS **12.18.\***, You can read the installation guide in [https://nodejs.org/en/download](https://nodejs.org/en/download/)

##### 2. Install yarn

Install yarn package manager with npm

```bash
$ npm install -g yarn
```

If you want to install yarn manually, visit the link below:

[https://classic.yarnpkg.com/en/docs/install](https://classic.yarnpkg.com/en/docs/install)

##### 3. Create .env File

Copy env.example to .env

```bash
$ cp env.example .env
```

Setup API URL

```bash
NODE_ENV=development

VUE_APP_BASE_URL=[Your Server Base URL]
VUE_APP_SERVER_URL=[Your Server URL]
```

##### 4. Run Application

To run application type:

```bash
yarn serve
```

To Build application type:

```bash
yarn build
```
