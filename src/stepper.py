#!/usr/bin/python
import RPi.GPIO as GPIO 
import time 

pin = 32
first = 1
gap = 1
second = 1

#31

firstCount = 2
secondCount = 10

firstSleepTimeOn = 0.030
firstSleepTimeOff = 0.100

secondSleepTimeOn = 0.030
secondSleepTimeOff = 0.078

gapSleepTime = 0.25

GPIO.setmode(GPIO.BOARD)
GPIO.setup(pin,GPIO.OUT)

                
if (first == 1):
        for x in range(firstCount):
                GPIO.output(pin, GPIO.LOW)      
                time.sleep(firstSleepTimeOn);
                GPIO.output(pin, GPIO.HIGH)
                time.sleep(firstSleepTimeOff);
print("in first train")

# wait for second string
if (gap==1):
        GPIO.output(pin, GPIO.LOW)
        time.sleep(gapSleepTime);
print("in gap"); 

if (second == 1):
        for x in range(secondCount):
                GPIO.output(pin, GPIO.LOW)
                time.sleep(secondSleepTimeOn);
                GPIO.output(pin, GPIO.HIGH)
                time.sleep(secondSleepTimeOff); 
print("in second train")
GPIO.cleanup()