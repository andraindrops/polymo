#!/usr/bin/env node
import { createApp } from "./create-app";

const run = async () => {
  createApp({ name: process.argv[2] });
};

run();
