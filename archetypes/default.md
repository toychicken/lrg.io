---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: ""
draft: true
author: "Leigh Garland"
mainImage:
  src: "/images/"
  title: "{{ replace .Name "-" " " | title }}"
images:
- "/assets/profile@600x600.gif"
##### Note - The title in the Front matter above is replayed at the top of the rendered article
---

