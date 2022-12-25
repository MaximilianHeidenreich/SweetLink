<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/MaximilianHeidenreich/SweetLink">
    <img src="https://deno.land/logo.svg" alt="Deno Logo" width="80" height="80">
  </a>

<h2 align="center">SweetLink</h2>

<p align="center">
    A lightweight but powerful URL shortener for your private cloud on <a href="http://deta.sh">Deta Space</a>.
    <br />
    <a href=""><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/MaximilianHeidenreich/SweetLink/issues">Report Bug</a>
    ·
    <a href="https://github.com/MaximilianHeidenreich/SweetLink/issues">Request Feature</a>
  </p>
</p>

<br><br>

<!-- ABOUT THE PROJECT -->

## About The Project

SweetLink is a lightweight but powerful URL shortener. It runns on <a href="http://deta.sh">Deta Space</a> inside your private cloud.
Due to this, you have full access and control over your shortend url's and data.
Additionally, SweetLink provides a greate user experience, a beautiful UI and powerful features like analytics.

### Project Goals

- [x] URL Shortener (redirect to long urls from small short code).
- [x] Easy UX & Pretty UI.
- [x] Password protected links.
- [x] Links with a limited max. number of unique visitors.
- [ ] Analytics
  - [x] Total visitor count.
  - [ ] Tracy analytics integration (In the future).

<br>

<!-- USAGE -->

## Usage

### Dashboard

#### Create a short link
1. Enter the long URL you want to shorten into the main input field.
2. (Optional) Adjust the settings by clicking the `cog` icon.
3. Shorten the URL by clicking the `submit` button.
4. The short link will automatically be copied into your clipboard. From here on, you can share it.

#### Settings
##### Title

The title is just a custom displayname you can set to identify your different short links more easily.

##### Custom ShortCode

If you don't set a custom short code, one will be created for you. 
You can use a custom shortcode to easily identify specific short links.

Example:
If you would want a short link for SweetLink's GitHub page, you might set the title to something like `SweetLink - GitHub page`

##### Password protected

You can enable password protection to require users to enter the password you specified before 
they get redirected to the target of the short link (your original long url).

##### Limit unique visitors

When enabled, a short link can only be accessed a limited number of times. After that, visitors will see an info-box 
telling them, that the limit has been reached.

##### Add tracking UTM's
Not implemented

##### Collect statistics

When enabled, visitors of your short link will see a `SweetLink` page before they get redirected. 
This page will collect the number of visitors as well as visitor metadata like user-agent, location etc. (in the future).
