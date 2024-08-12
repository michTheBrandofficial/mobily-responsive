FRAMEDIR="./src/frames/"

echo What is the device name?

read FRAMENAME

cd $FRAMEDIR

mkdir $FRAMENAME

cd $FRAMENAME

touch index.tsx

mkdir svg

cd svg

touch status-bar.tsx device-frame.tsx virtual-home-button.tsx
