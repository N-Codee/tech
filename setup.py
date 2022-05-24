from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in tech/__init__.py
from tech import __version__ as version

setup(
	name="tech",
	version=version,
	description="Tech",
	author="alex",
	author_email="alexbenny94@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
