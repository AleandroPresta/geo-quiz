ng build --configuration production --base-href "https://aleandropresta.github.io/geo-quiz/"
echo "[DEPLOY] Build completed."

# Move all the files from dist/geo-quiz/browser to dist/geo-quiz
mv dist/geo-quiz/browser/* dist/geo-quiz
echo "[DEPLOY] Files moved from browser to dist/geo-quiz."

# Remove the browser folder
rm -r dist/geo-quiz/browser
echo "[DEPLOY] Browser folder removed."

npx angular-cli-ghpages --dir=dist/geo-quiz
echo "[DEPLOY] Deployed to GitHub Pages."