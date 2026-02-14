import os

EXCLUDE_FOLDERS = {"node_modules"}   # add more names if needed

def tree(dir_path=".", prefix=""):
    try:
        files = sorted(os.listdir(dir_path))
    except PermissionError:
        return

    # filter excluded folders/files
    files = [f for f in files if f not in EXCLUDE_FOLDERS]
    total = len(files)

    for index, name in enumerate(files):
        path = os.path.join(dir_path, name)
        connector = "└── " if index == total - 1 else "├── "
        print(prefix + connector + name)

        if os.path.isdir(path):
            extension = "    " if index == total - 1 else "│   "
            tree(path, prefix + extension)

if __name__ == "__main__":
    print(".")
    tree(".")
