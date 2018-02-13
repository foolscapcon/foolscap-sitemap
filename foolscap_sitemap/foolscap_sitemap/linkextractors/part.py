from scrapy.linkextractors.lxmlhtml import LxmlLinkExtractor, LxmlParserLinkExtractor

import six
from six.moves.urllib.parse import urljoin

import lxml.etree as etree
from lxml.etree import iselement
from w3lib.html import strip_html5_whitespace
from w3lib.url import canonicalize_url

from scrapy.link import Link
from scrapy.utils.misc import arg_to_iter, rel_has_nofollow
from scrapy.utils.python import unique as unique_list, to_native_str
from scrapy.utils.response import get_base_url
from scrapy.linkextractors import FilteringLinkExtractor

# from lxml/src/lxml/html/__init__.py
XHTML_NAMESPACE = "http://www.w3.org/1999/xhtml"

_collect_string_content = etree.XPath("string()")

class PartialParserLinkExtract(LxmlParserLinkExtractor):
    def _extract_links(self, selector, response_url, response_encoding, base_url):
        links = []
        # hacky way to get the underlying lxml parsed document
        selector_root = selector
        if not iselement(selector_root):
            selector_root = selector.root
        for el, attr, attr_val in self._iter_links(selector_root):
            # pseudo lxml.html.HtmlElement.make_links_absolute(base_url)
            try:
                if self.strip:
                    attr_val = strip_html5_whitespace(attr_val)
                attr_val = urljoin(base_url, attr_val)
            except ValueError:
                continue  # skipping bogus links
            else:
                url = self.process_attr(attr_val)
                if url is None:
                    continue
            url = to_native_str(url, encoding=response_encoding)
            # to fix relative links after process_value
            url = urljoin(response_url, url)
            link = Link(url, _collect_string_content(el) or u'',
                        nofollow=rel_has_nofollow(el.get('rel')))
            links.append(link)
        return self._deduplicate_if_needed(links)    

class PartialLinkExtractor(LxmlLinkExtractor):
    def __init__(self, allow=(), deny=(), allow_domains=(), deny_domains=(), restrict_xpaths=(),
                 tags=('a', 'area'), attrs=('href',), canonicalize=False,
                 unique=True, process_value=None, deny_extensions=None, restrict_css=(),
                 strip=True):
        tags, attrs = set(arg_to_iter(tags)), set(arg_to_iter(attrs))
        tag_func = lambda x: x in tags
        attr_func = lambda x: x in attrs
        lx = PartialParserLinkExtract(
            tag=tag_func,
            attr=attr_func,
            unique=unique,
            process=process_value,
            strip=strip,
            canonicalized=canonicalize
        )

        super(LxmlLinkExtractor, self).__init__(lx, allow=allow, deny=deny,
            allow_domains=allow_domains, deny_domains=deny_domains,
            restrict_xpaths=restrict_xpaths, restrict_css=restrict_css,
            canonicalize=canonicalize, deny_extensions=deny_extensions)    

