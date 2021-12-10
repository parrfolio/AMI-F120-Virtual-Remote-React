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

  GNU nano 5.4                              /etc/network/interfaces                                        
# interfaces(5) file used by ifup(8) and ifdown(8)
# Include files from /etc/network/interfaces.d:
source /etc/network/interfaces.d/*
allow-hotplug wlan0
iface wlan0 inet dhcp
wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf

What ports are open
sudo netstat -tlnp