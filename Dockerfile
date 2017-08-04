FROM node:6

COPY . /home/ascbot

WORKDIR /home/ascbot

RUN npm install --production

ENTRYPOINT ["npm"]
