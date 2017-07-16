# Sonic 1 + Sonic &amp; Knuckles/Blue Sphere Level/Code Generator

This is a code and map generator for the 'Get Blue Spheres!' game that you get by locking the 'Sonic the Hedgehog' game onto 'Sonic & Knuckles' (for the Sega Genesis - also the 'Blue Sphere' game in Sonic Mega Collection you get by playing Sonic 1 and Sonic 3d Blast 20 times each). Note that most of the credit for this creation and copyright goes to Koji Nishio, the original author of this implementation of the set of algorithms. You can find the original at Koji's Sonic Kontrol Get Blue Spheres page. My version was created to understand the code and to make it possible to generate maps and info for hundreds of levels at a time, and to do some other interesting things with it (like find custom fun levels and have different display modes). It also adds the ability to view the 'Non-Sonic 1' version of each code.

A few notes about using the 'Find Custom Stage' function: Every level/stage is comprised of four separate sections, and each section is one out of 128 unique possibilities. Thus you enter numbers from 0 to 127 to find a stage that has each specified section. Not every stage has a corresponding level number due to how the algorithm works. (The stage number directly corresponds to the sections, whereas the level number is scrambled to get a pseudorandom stage. The scrambling algorithm can only produce a limited subset of stages.) However, rotating or otherwise rearranging the sections may produce a valid level number when all sections are below 125. As for levels with the remaining three, section 127 will only appear in a level in the top-right position, section 126 in the top-right and bottom-right positions, and 125 in all but the bottom-left position.

Some random factoids:

* There is a grand total of 2038438443 blue spheres and 1877085250 rings in the 134217728 levels of Blue Sphere.
* The average difficulty is 8.


If you're interested in how the algorithm works or want to try it offline, you may download the complete Blue Sphere Generator (353 kB). There is also more information on the Blue Sphere page on Wikipedia and on the Sonic 2 Beta Message Boards. And if you have any questions or comments, please feel free to email me.

Note that the minimum and maximum for levels and stages are 1 and 134217728, and 0 and 268435455, respectively.

One final warning: don't try to generate a list of more than a few thousand levels. Since the generation is done with Javascript, it will slow your system down a great deal when processing a large number of levels.
