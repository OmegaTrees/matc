from requests import get

class Main:
    def __init__(self, url: str, password: str | None = None) -> None:
        self._files_info: dict[str, dict[str, str]] = {}
        self._parse_url_or_file(url, password)

    def _parse_links_recursively(self, content_id: str, password: str | None = None) -> None:
        url: str = f"https://api.gofile.io/contents/{content_id}?wt=4fd6sg89d7s6&cache=true"

        if password:
            url = f"{url}&password={password}"

        user_agent: str = "Mozilla/5.0"  # You can specify a user agent here
        headers: dict[str, str] = {
            "User-Agent": user_agent,
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "*/*",
            "Connection": "keep-alive",
        }

        response = get(url, headers=headers).json()

        if response["status"] != "ok":
            print(f"Failed to get a link as response from {url}.")
            return

        data = response["data"]

        if "password" in data and "passwordStatus" in data and data["passwordStatus"] != "passwordOk":
            print(f"Password protected link. Please provide the password.")
            return

        if data["type"] == "folder":
            for child_id in data["children"]:
                child = data["children"][child_id]
                if child["type"] == "folder":
                    self._parse_links_recursively(child["id"], password)
                else:
                    # Save file info
                    self._files_info[child["id"]] = {
                        "filename": child["name"],
                        "link": child["link"]
                    }

        else:
            self._files_info[data["id"]] = {
                "filename": data["name"],
                "link": data["link"]
            }

    def _print_links(self) -> None:
        """
        Print the download links.
        """
        for file_id, file_info in self._files_info.items():
            print(f"Filename: {file_info['filename']}")
            print(f"Download link: {file_info['link']}")
            print("-" * 50)

    def _parse_url_or_file(self, url_or_file: str, _password: str | None = None) -> None:
        if not url_or_file.startswith("http"):
            print("Invalid URL provided.")
            return

        content_id = url_or_file.split("/")[-1]
        self._parse_links_recursively(content_id, _password)
        self._print_links()

if __name__ == "__main__":
    try:
        from sys import argv

        url: str | None = None
        password: str | None = None
        argc: int = len(argv)

        if argc > 1:
            url = argv[1]

            if argc > 2:
                password = argv[2]

            # Run
            print(f"Starting, please wait...\n")
            Main(url=url, password=password)
        else:
            print(f"Usage:\n"
                  f"python gofile-downloader.py https://gofile.io/d/contentid\n"
                  f"python gofile-downloader.py https://gofile.io/d/contentid password")
    except KeyboardInterrupt:
        exit(1)
