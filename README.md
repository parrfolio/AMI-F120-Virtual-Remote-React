# AMI F 120 Jukebox Virtual Remote in React

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
### Rasperry pi configs
Disable Firewall: 
```systemctl stop firewalld```
### What ports are open
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

### NPM Commands & Cleaning when building between Node Versions
npm cache clean --force
npm cache verify

### NVM Commands
https://heynode.com/tutorial/install-nodejs-locally-nvm/

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