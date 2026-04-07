# Future Mobile Architecture Brainstorm

## The Problem
The current System Blueprint portfolio heavily leverages an infinite 2D drafting canvas (`framer-motion` `drag`). This translates terribly to a 6-inch mobile touch screen—inadvertent panning, clashing with native browser scroll, and overcrowded node text.

## Idea 1: The 'Read-Only' Terminal
Instead of showing the map on mobile, the entire site defaults to the `CommandPalette`. 
- The background is pure black or grid.
- The user is greeted with a terminal prompt: `> Type help...`
- They navigate entirely by typing commands or clicking autocomplete suggestions.
- **Vibe:** Extreme hacker/founder energy. It forces interaction.

## Idea 2: The Vertical System Topology
Instead of an absolute XY coordinate map, we render the SVG lines and architecture nodes linearly down the screen.
- It acts like a standard feed, but visually disguised as a single topological wire going down the center of the screen, with nodes branching off.

## Conclusion Pending
Desktop experience reigns supreme currently. Revisit this doc when analytics show high mobile bounce rate or when ready to dedicate UI/UX engineering time specifically for touch screens.
