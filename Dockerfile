FROM node:7.10.0

ENV NODE_ENV production

RUN git clone https://github.com/Webini/wait-for-it ./wait-for-it && \
    mv ./wait-for-it/wait-for-it.sh /usr/local/bin && \
    chmod +x /usr/local/bin/wait-for-it.sh

VOLUME [ "/home/node/server/data" ]

ADD "src" "/home/node/server/src"
ADD [ \
  "package.json", \
  "server.js", \
  "/home/node/server/" \
]

RUN chown -R node. /home/node/server

USER node
WORKDIR /home/node/server

RUN touch .env && \
    npm i 

ENTRYPOINT [ "node", "./run.js" ]

CMD [ "worker" ]