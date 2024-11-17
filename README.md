To run the project, first go to jiachenning.github.io repo, and then on terminal run:
npm run start
THEN GO TO 
http://localhost:3000/index


Every time before commit: 
(need to copy everything from build directory to the root directory, since Github needs index.html at the root level to have the page rendered)
npm run build
cp -r build/* .
git add .
...

Or you can just copy content of index.html file (in build directory) to the root manually since the rest doest not really change 