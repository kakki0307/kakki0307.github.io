// Mobile Safari in standalone mode
if (('standalone' in window.navigator) && window.navigator.standalone) {
    window.addEventListener('load', function() {
        var links = document.links,
            link,
            i;
        for (i = 0; i < links.length; i++) {
            // Don't do this for javascript: links
            if (!~(link = links[i]).href.toLowerCase().indexOf('javascript')) {
                if('href' in link && link.href.indexOf('http') !== -1 && link.href.indexOf(document.location.host) !== -1)
                {
                    link.addEventListener('click', function(event) {
                        event.preventDefault();
                        document.location.href = this.href;
                    }, false);
                }
            }
        }
    }, false);
}
