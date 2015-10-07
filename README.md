# JustGiving DNA dna-test component

## JustGiving DNA
For the tools and workflow used to contribute to JustGiving DNA, including this component, see the [JustGiving DNA documentation](https://github.com/JustGiving/GG.FrontEnd.DNA)

## Install
Look in the [component release notes](https://github.com/JustGiving/GG.FrontEnd.DNA.dna-test/releases) for the latest major version

```bower install git@github.com:JustGiving/GG.FrontEnd.DNA.dna-test.git#<major_version>.x --save```

Once installed, from the root directory run:

```bower install```

```npm install```


## Update
```bower update dna-dna-test``` 

updates to latest minor or patch version (backwards compatible)

## Major update
Manually increment the major digit in the version flag in the microsite's ```bower.json``` then ```bower update dna-dna-test```

## Usage
- For Less modules, ```@import``` the required modules into your microsite's Less main file. Note that paths to ```bower_components``` are automatically resolved so your ```@import``` directive path should start at ```dna-dna-test/```
- For javascript modules, ```require()``` the required modules into your microsite's javascript main file and use them as needed. Note that paths to ```bower_components``` are automatically resolved so your ```require()``` path should start at ```dna-dna-test/```

## Release
- [Pull request](https://www.atlassian.com/git/tutorials/making-a-pull-request/) your changes and merge into ```master``` and push

- All releases use [semantic versioning](http://semver.org/) release numbering to describe the changes made

- Once your changes are in ```master``` **and pushed** there are two steps to making a release:

1. Decide whether you have made [patch, minor or major](http://semver.org/) update and run **one of**: 
  
  ```js
  // If you made a semver patch change
  gulp release:patch

  // If you made a semver minor change
  gulp release:minor
  
  // If you made a semver major change
  gulp release:major
  ``` 

  Gulp will update your component's ```bower.json``` and ```package.json``` version properties and create and push a new semver git tag. Gulp will report to you the tag number it has created

1. From Github make a new release [releases > draft new release]. Choose the tag number Gulp has just created as the tag e.g. ```0.1.0``` and set the release title as ```v<tag_number>'``` e.g. ```v0.1.0```. Include release notes detailing the changes made. If the release is a major (non-backwards compatible change), additionally describe the changes required to use the release

## Symlinking to GG.FrontEnd.DNA.dna-test
- In GG.FrontEnd.DNA.dna-test run ```bower link```
- In the component or microsite importing ```dna-dna-test``` run ```bower link dna-dna-test```
- When done, unlink with ```bower uninstall dna-dna-test``` then run ```bower install```
- For more about bower link see section [Developing across two component sets simultaneously](https://github.com/JustGiving/GG.FrontEnd.DNA#developing-across-two-component-sets-simultaneously) in the JustGiving DNA documentation

## DNA dependencies
- ```dna-core```

## DNA dev dependencies
- ```justgiving-tools```
- ```justgiving-bundle-global```
- ```justgiving-bundle-head```
- ```dna-styleguide```

## Browser support

