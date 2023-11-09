# AMI F 120 Jukebox Virtual Remote in React
### To Run Dev on Mac (run latest node -v)
```npm run dev```
Will auto reload on changes. Ligths will not work
### To Run Build on Raspi
```npm run build && npm start```
## SSH Keys setup for Github
https://stackoverflow.com/questions/38556096/github-permission-denied-publickey-fatal-could-not-read-from-remote-reposit
## SHH to Raspi
```shh pi@raspberrypi```
## Temp Notes
Need test SSL HTTPS on Raspi

```const ws281x = require("@gbkwiatt/node-rpi-ws281x-native")```

I turned off for mac dev
Note: I have a custom version of ws281x on Raspi. Do not rebuild package on pi

For mac dev this dependency was removed from package under "dependencies"
```"@gbkwiatt/node-rpi-ws281x-native": "^1.0.1",```

## Project

App to control my AMI F 120 Jukebox stepper remotely through tablet or mobile device. 

### Capabilities

1. Send pulses to stepper for selections
2. Light show
3. Cancel Action
4. Turn on/off Machine
5. Random Selection

### Todo

1. Stepper sequences
2. Lights sequences
3. GUI

###  GPIO Test Proceedures in Python
python3
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(32,GPIO.OUT)
GPIO.output(32,GPIO.LOW)
GPIO.output(32,GPIO.HIGH)

## Set up Raspi
### Configs
Disable Firewall: 
```systemctl stop firewalld```
### Check port
sudo netstat -tlnp
### HD Allocation
 df -h
### Set of commands to purge unneeded package files:
sudo apt-get autoremove
sudo apt-get clean

### Clone HD if you need to upgrade HD card
https://github.com/billw2/rpi-clone
sudo rpi-clone sdb
### Set correct permissions (ownership) so npm can access your (sub)directories with your normal user permissions:

sudo chown -R $USER <directory>
Most likely: sudo chown -R pi /home/pi/

## LED Light Setup
### Lights
https://github.com/meg768/rpi-ws281x
Only works with node 10.21.0
Only works on Raspberry Pi linux and will fail on MacOS
Use NVM to change

### Node Library for Lights

Trying this one now:https://github.com/gbkwiatt/node-rpi-ws281x-native

https://github.com/FeBe95/node-rpi-ws281x-native/tree/a705e6826663bf29e18bb6f55e30c9e80c612860

Tutorial 
https://tutorials-raspberrypi.com/connect-control-raspberry-pi-ws2812-rgb-led-strips/


### Troublshooting Lights
The leds do not light up as expected?

It is important to have common ground for LEDs and RPi. Assure, ground is same for all of them (Thanks to euchkatzl).

Assure to connect the LED strip in the right direction. Little arrows indicate that along the strip (Thanks to euchkatzl).

Assure correct functionality of leds:

cd ~/rpi_ws281x/python/examples vim strandtest.py # Set number of leds, pin, etc. sudo python strandtest.py

The leds should light up now…

Disable the RPis soundcard (since it might interfere with the PMW-channel, sending data to the LEDs. Thanks to ELViTO12 for reporting):

sudo sh -c "echo blacklist snd_bcm2835 >> /etc/modprobe.d/alsa-blacklist.conf";
sudo reboot;

In case the LEDs are flickering as shown in this video https://www.youtube.com/watch?v=UHxVS8SkXOU (Thanks to oxivanisher), consider the usage of a level-shifter to connect the GPIO-pin of the raspberry to the LED-strip. Further reading: https://github.com/jgarff/rpi_ws281x/issues/127 https://github.com/bk1285/rpi_wordclock/issues/38


### Fixing node-rpi-ws281x-native for node 17.5
ref: https://github.com/ibmtjbot/tjbot/issues/158

//install from package manager in node_modules
npm install @gbkwiatt/node-rpi-ws281x-native

//install outside project
npm install rpi-ws281x --save 

// cd to
~/node_modules/@gbkwiatt/node-rpi-ws281x-native/src

// delete rpi_ws281x
rm -rf rpi_ws281x/

// copy 
cp -r ~/rpi_ws281x ~/node_modules/@gbkwiatt/node-rpi-ws281x-native/src

// cd out to main folder
cd ~/node_modules/@gbkwiatt/node-rpi-ws281x-native/

// run rebuild
sudo node-gyp rebuild

// run build
npm run build

//start
npm start


//anoter potential fix
$ npm install rpi-ws281x-native@latest
$ git clone --single-branch --branch raspi4support https://github.com/jimbotel/rpi_ws281x.git
$ cp -r rpi_ws281x/* node_modules/rpi-ws281x-native/src/rpi_ws281x
$ npm build node_modules/rpi-ws281x-native


//also had to fix the hardcoding of channel 1 if you are using mutple gpio's and channels as I am
More info here: https://github.com/beyondscreen/node-rpi-ws281x-native/commit/49c7018da34df5cd8f9d653ba0f17f8141365327


// pins that can be used
    PWM0, which can be set to use GPIOs 12, 18, 40, and 52.
        Only 12 (pin 32) and 18 (pin 12) are available on the B+/2B/3B

     PWM1 which can be set to use GPIOs 13, 19, 41, 45 and 53.
        Only 13 is available on the B+/2B/PiZero/3B, on pin 33


### NPM Commands & Cleaning when building between Node Versions
npm cache clean --force
npm cache verify

## Installing Node 
https://www.instructables.com/Install-Nodejs-and-Npm-on-Raspberry-Pi/
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-with-nvm-node-version-manager-on-a-vps

### NVM Commands
https://heynode.com/tutorial/install-nodejs-locally-nvm/
// check version
node -v || node --version

// list installed versions of node (via nvm)
nvm ls

// install specific version of node
nvm install 6.9.2

// set default version of node
nvm alias default 6.9.2

// switch version of node
nvm use 6.9.1

// to list available remote versions of node (via nvm)
nvm ls-remote

Install Node
nvm install <node_version>      // Install a specific Node version
nvm install node                // Install latest Node release (Current)
nvm install --lts               // Install latest LTS release of NodeJS
nvm install-latest-npm          // Install latest NPM release only

List Available Node Releases
nvm ls-remote
nvm ls-remote | grep -i "latest"        
nvm ls-remote | grep -i "<node_version>"

List Installed Nodes
nvm list node                   // Lists installed Node versions
nvm list  (or)  nvm ls          // Lists installed Node versions with additional release info

Switch To Another Node Version
nvm use node                      // Switch to the latest available Node version
nvm use <node_version_or_alias>  // Switch to a specific version
nvm use --lts                    // Switch to the latest LTS Node version

Verifying Node Version
node -v  (or)  node --version
npm -v   (or)  npm --version
nvm -v   (or)  nvm --version

Set Alias
nvm alias default node                  // Always defaults to the latest available node version on a shell
nvm alias default <node_version>        // Set default node version on a shell
nvm alias <alias_name> <node_version>   // Set user-defined alias to Node versions 

nvm unalias <alias_name>                // Deletes the alias named <alias_name>

Path to Node Executable
nvm which <installed_node_version>      // path to the executable where a specific Node version is installed

Uninstall Specific Node Version
nvm uninstall <node_version>    // Uninstall a specific Node version
nvm uninstall --lts             // Uninstall the latest LTS release of Node
nvm uninstall node              // Uninstall latest (Current) release of Node

Uninstall NVM
 To remove, delete, or uninstall nvm, just remove the $NVM_DIR folder (usually ~/.nvm)




