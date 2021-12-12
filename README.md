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