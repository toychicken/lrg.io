## Missing 'cover' attributes for pages with images

Hopefully the table below is empty!

```dataview
TABLE images
FROM ""
WHERE images AND length(images) > 0 AND !cover
```

