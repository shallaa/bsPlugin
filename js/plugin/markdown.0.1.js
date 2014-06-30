// https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
bs['plugin+']( 'method', 'md2html', (function(){
	'use strict';
	var rUrl = /^https?:\/\/[-\w.]+(:[0-9]+)?(\/([\w\/_.#!]*)?)?$/,
		linkUrls = {},
		rQuoteHead = /\n>\s/g,
		synts = [
		{r:/^\[(.*)\]:\s?(.*)\n/gm, t:function( org, k, v ){// linkUrls
				return linkUrls['"'+k.toLowerCase()+'"'] = v, '';
			}
		},
		{r:/^>\s(.*)((\n>\s.*)*)/gm, t:function( org, v1, v2 ){// Blockquotes
				//console.log(v1+v2.replace(/\n>\s/g, ''));
				return '<blockquote>'+ (v1+v2.replace( rQuoteHead, ' ' )) +'</blockquote>';
			}
		},
		{r:/^(.*)$\n={6,}/gm, t:'<h1>$1</h1>'},// alt-h1
		{r:/^(.*)$\n-{6,}/gm, t:'<h2>$1</h2>'},// alt-h2
		{r:/^#{6}\s(.*)$/gm, t:'<h6>$1</h6>'},// h6
		{r:/^#{5}\s(.*)$/gm, t:'<h5>$1</h5>'},// h5
		{r:/^#{4}\s(.*)$/gm, t:'<h4>$1</h4>'},// h4
		{r:/^#{3}\s(.*)$/gm, t:'<h3>$1</h3>'},// h3
		{r:/^#{2}\s(.*)$/gm, t:'<h2>$1</h2>'},// h2
		{r:/^#{1}\s(.*)$/gm, t:'<h1>$1</h1>'},// h1
		{r:/^[-\*_]{3,}$/gm, t:'<hr>'},// hr
		{r:/\*\*(.*)\*\*/gm, t:'<strong>$1</strong>'},// strong
		{r:/__(.*)__/gm, t:'<strong>$1</strong>'},// strong
		{r:/~~(.*)~~/gm, t:'<del>$1</del>'},// strong
		{r:/_(.*)_/gm, t:'<em>$1</em>'},// em
		{r:/\*(.*)\*/gm, t:'<em>$1</em>'},// em
		{r:/\s{2,}$/gm, t:'<br />'},// br
		{r:/\!(\[(.*)\])?\[(.*)\]/gm, t:function( org, s1, alt, k ){// img ![][]
				return '!'+(alt?'['+alt+']':'')+'('+linkUrls['"'+k.toLowerCase()+'"']+')';
			}
		},
		{r:/\!(\[(.*)\])?\((\S*)\s?(.*)?\)/gm, t:function( org, s1, alt, src, title ){// img ![]()
				return '<img src="'+src+(alt?'" alt="'+alt:'')+(title?'" title='+title:'')+'></img>';
			}
		},
		{r:/\[(.*)\]\[(.*)\]/gm, t:function( org, v, k ){// link [][]
				return '<a href="'+linkUrls['"'+k.toLowerCase()+'"']+'">'+v+'</a>';
			}
		},
		{r:/\[(.*)\]\((.*)\)/gm, t:'<a href="$2">$1</a>'},// link []()
		{r:/\[(.*)\]/gm, t:function( org, k ){// link []
				return '<a href="'+linkUrls['"'+k.toLowerCase()+'"']+'">'+k+'</a>';
			}
		},
		{r:/^(\s{0,})[\*\+-]{1}\s(.*)((\n{1}\s{0,}[\*\+-]{1}\s.+)*)/gm, t:(function(){
				var rInfo = /^(\s{0,})[\*\+-]{1}\s(.*)/;
				return function( org, v0, v1, v2 ){
					var ret, rsps, psps, nsps, sps, spsln, cntnt,
						t0, t1, i, j;
					ret = '<li>'+ v1 +'</li>';
					rsps = v0;
					psps = -1;
					console.log(111111);
					console.log(v2);
					t0 = v2.split('\n');
					for( i = 1, j = t0.length; i < j; i++ ){
						t1 = rInfo.exec(t0[i]);
						sps = t1[1];
						spsln = sps.length
						cntnt = t1[2];
						if(i < j-1) nsps = rInfo.exec(t0[i+1])[1].length;
						else nsps = -1;
						if( sps != rsps ){
							if( spsln > psps ) ret += '<ul>';
						}
						ret += '<li>'+ cntnt +'</li>';
						if( sps != rsps ){
							if( spsln > nsps ) ret += '</ul>';
							psps = spsln;
						}
					}
					ret = '<ul>'+ ret +'</ul>\n';
					return ret;
				};
			})()
		},
		{r:/^(\s{0,})[\*\+-]{1}\s(.*)/gm, t:function( org, v0, v1, v2 ){
				var ret;
				ret = '<ul><li>'+ v1 +'</li></ul>';
				
				return ret;
			}
		},
		{r:/^(.*)\n{2}/gm, t:'<p>$1</p>\n'}// p
	];
	return function(path){
		var synt, hash, line, lines, t0, i, j;
		path = path || window.location.href;
		if( rUrl.test(path) ){
			if( path.indexOf('#!') < 0 ) throw new Error('hashbang does not exist');
			t0 = path.split('#!');
			path = t0[0].substr( 0, path.lastIndexOf('/') + 1 );
			hash = t0[1];
		}else{
			hash = path;
			path = window.location.href;
			path = path.substr( 0, path.lastIndexOf('/') + 1 );
		}
		t0 = bs.get( null, path + hash ).replace(/\r\n|\r/gm, '\n');
		for(i = 0; i<synts.length; i++){
			synt = synts[i];
			t0 = t0.replace( synt.r, synt.t );
		}
		return t0;
	};
})() );