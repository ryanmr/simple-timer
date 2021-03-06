Simple Timer
============

A really simple timer, showing the time *remaining* and *elapsed* in the timer.

Broadly, this is still a work in progress, but definitely usable.

You can view the live version via [ifupdown.com/timer](http://ifupdown.com/timer/).

Made With
---------

* [npm](https://www.npmjs.com/): to use gulp
* [gulp](http://gulpjs.com/): to handle concat and babel-js (and countless other gulp packages)
* ~~[react.js](http://facebook.github.io/react/): to handle the UI~~
* [vue.js](http://vuejs.org/): to handle the ui, plus a tiny bit of data management
* [humanize-duration.js](https://github.com/EvanHahn/HumanizeDuration.js): to handle human duration time strings
* [zepto.js](http://zeptojs.com/): facilitating common javascript tasks

Setup
-----

Run `gulp --production` in the terminal to *concatenate* and *transpile* the es6 javascript and sass.

Usage
-----

Use the *control panel* to specify the length of the timer, hit save, and enjoy. You can also specify an offset if you started your timer late, but still want the relative durations shown to be correct - use the offset field for this purpose.

For example, if your time is supposed to be 60 minutes in duration, but you started the timer 12 minutes late, you could simply set the duration to 48 minutes. The down side of this method is the *elapsed* time will be incorrect since it had actually started 12 minutes ago. Setting the offset to 12 minutes will keep the *elapsed* time intact.

Most importantly, the URL generated by the timer is sharable.

Post Notes 02 - A Vue Commentary
--------------------------------

As mentioned, React was too heavy for my needs. I have been following [vue.js](http://vuejs.org/) for a month now, and I enjoy it more than React. It keeps my HTML in the HTML, and my JavaScript in my JavaScript. Also, as it turns out, I find two way data binding really useful.

For example:
* with vue.js, the `vendor.js` file is 109K
* with react.js, the `vendor.js` file is 203K
* with vue.js, the `app.js` file is only 1.6K
* with react.js the `app.js` file is 2.8K

In the scope of this tiny project, surely both vue and react are overkill. Having practiced with both, I think the vue.js version will be easily for me to maintain, and add new features to in the future.

Post Notes 01 - A React Commentary
----------------------------------

I wrote the original version of the Simple Timer in July 2015. The primary purpose was to count up and down while I was recording a podcast (and the late start feature was influenced by me forgetting to start the timer on time). During that time, I was knee deep in [react.js](http://facebook.github.io/react/), which was fun.

Since then, I realized some things. [react.js](http://facebook.github.io/react/) was probably not really necessary here, and in fact, hurts the timer - 600kb (before compression) is allocated towards react.js and its add-ons. Straight up jQuery or an alternative would have been lighter and easier. It was great experience, but certainly overkill.
