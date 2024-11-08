import platform, os


input("This will install Flask, are you sure?\n[Press enter]\n")

python = "python3"
if platform.system() == "windows":
	python = "python"

os.system(f"{python} -m pip install Flask")
