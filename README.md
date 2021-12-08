# AMI Jukebox App

## Background

App to control AMI F 120 Jukebox lights and stepper. 

> ### This is a work in progress but hoping to launch sometime in 2020.

~ [By Ryan Parr](https://instagram.com/everydayspinjackets)

ToDo:

1. Stepper sequences to play songs
2. Lights
3. Cancel Action
4. Turn on/off Machine



> ###  GPIO Test Proceedures

python3
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(32,GPIO.OUT)
GPIO.output(32,GPIO.LOW)
GPIO.output(32,GPIO.HIGH)