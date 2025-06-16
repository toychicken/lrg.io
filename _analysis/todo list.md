All the stuff I have to do

* [ ] MUST refactor the cover attributes, as Obsidian doesn't really like YAML objects
* [ ] Need a happy solution for making posts in social medias - mas
* [ ] Reformatting the Taxonomy and Term pages so they look, err, cooler?
* [ ] Fix the size of the book covers to a relative font size set at... `<aside>`?
	* [ ] Also, make sure all the styles will work, if I put a book cover into the body of the main section
	* [ ] Partly to make sure that these will work nicerer in Mobile / small views
	* [ ] Consider making each book title a WebComponent? Dump all the styles inside the component? 🤔
* [ ] Do the gross `<main>` and `<aside>` layout in preparation for some masonry stying, different sized items, small things, bigger things etc. But I think I'll need to ditch the Everylayout.dev floating aside thing. 

And from other places in the site...
```dataview
TASK 
WHERE !completed 
AND !contains(file.path, "_analysis") GROUP BY file.path
```

Do I need more categories / things which have a category defined? 🤔

```dataview
TABLE category
FROM ""
WHERE category
```

