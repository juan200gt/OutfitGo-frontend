FROM node:22-alpine

RUN apk add --no-cache bash

RUN npm install -g @angular/cli@19

RUN echo 'alias ng-serve="ng serve --host 0.0.0.0 --poll 2000"' >> ~/.bashrc

WORKDIR /app

CMD ["bash"]