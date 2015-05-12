# grunt-gemini

> A grunt gplugin got git revision. You have to install this plugin where the .git is in because it use git command to get the revision of the files.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gemini --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gemini');
```

## The "gemini" task

### Overview
In your project's Gruntfile, add a section named `gemini` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gemini: {
    options: {
      // Task-specific options go here.
    },
    files: [{
      // Target-specific file lists and/or options go here.
    }],
  },
});
```

### Options

#### options.repo
Type: `String`
Default value: `',  '`

A string value that where the git repo is relate to the Gruntfile.js dir.

#### options.alias
Type: `Object`
Default value: `{}`

Alias of modules.


### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  gemini: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  gemini: {
    options: {
      repo: 'tmp/',     // Src matches are relative to this path
      alias:{
        'aaaaaaaa':'bbbbbbb'
      }
    },
    files: [{
      expand: true,     // Enable dynamic expansion.
      cwd: 'src',      // Src matches are relative to this path.
      src: ['**/*'], // Actual pattern(s) to match.
      dest: 'dist',   // Destination path prefix.
      ext: '.css'
    }]
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
