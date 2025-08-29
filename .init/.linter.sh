#!/bin/bash
cd /home/kavia/workspace/code-generation/event-booking-and-management-app-13870-14375/WebFrontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

