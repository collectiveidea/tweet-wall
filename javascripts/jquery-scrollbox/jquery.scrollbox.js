// Copyright (c) 2008 John Allison
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// begin closure
( function( $ ) {
	
	var BUFFER_TIME = 20;		// Need a buffer so our CSS attribute reset doesnt interfere
								// with the animation modifying the same CSS attributes.
	var opts;
	var queue = new Array();
	var boxes = null;

	jQuery.fn.scrollbox = function( options ) {
		// Extend out default options with those provided
		opts = jQuery.extend( { }, jQuery.fn.scrollbox.defaults, options );
		boxes = this;
		
		// Iterate over each matched element
		return boxes.each( function( ) {
			$this = jQuery( this );
			
			// Check structure - we expect a list element
			// 		<div><ul></ul></div>
			// If it doesn't exist, create the list
			if ( $this.find( 'ul' ).length == 0 ) {
				$this.append( '<ul></ul>' );
			}
			 
			// modify CSS
			$this.css( 'position', 'relative' );
			$this.css( 'overflow', 'hidden' );
			$this.find( 'ul' ).css( 'position', 'relative' );
			$this.find( 'ul' ).css( 'margin', '0px' );
			
			// TODO don't overwrite current values?
			setHiddenSpaceSize( $this.find( 'ul' ), 0, 0 );
		});
	};
	
	jQuery.fn.scrollbox.push = function( items ) {
		if ( boxes == null ) return false;
		
		return boxes.each( function( ) {
			$this = jQuery( this );
			var list = $this.find( 'ul' );
			
			items.each( function( ) {
				
				if ( parseInt( list.css( 'top' ) ) == 0 ) {
					// prepend item
					list.prepend( this );
					
					// find height of item
					var height = jQuery( this ).outerHeight( { margin: true } );
					
					// set top and padding to proper height to hide item
					setHiddenSpaceSize( list, -height, 0 );
					
					// animate padding to height of item
					list.animate( { paddingTop: height }, opts.speed );
					
					// after animation finishes
					// 		1) return padding to '0px'
					//		2) return positioning to '0px'
					// 		3) remove any children over the max
					//		4) begin animating any queued items
					setTimeout( function() {
						setHiddenSpaceSize( list, 0, 0 );
						
						if ( list.children( 'li' ).length > opts.maxsize )
							jQuery( jQuery( list.children( 'li' ) ).slice( opts.maxsize ) ).remove();
						
						processQueuedItems.call( $this );
					}, opts.speed + BUFFER_TIME );
				} else {
					// We are currently animating, queue up the item
					queue.push( jQuery( this ) );
				}
			});
		});
	};
	
	jQuery.fn.scrollbox.pop = function( ) {
		if ( boxes == null ) return false;
		
		return boxes.each( function( ) {
			$this = jQuery( this );
			var list = $this.find( 'ul' );
			var item = list.children( 'li:first' );
			
			if ( parseInt( list.css( 'top' ) ) == 0 ) {
				// find height of top item
				var height = item.outerHeight( { margin: true } );
				
				// set top and padding to proper height to hide item
				setHiddenSpaceSize( list, -height, height );
				
				// animate padding to '0px'
				list.animate( { paddingTop: 0 }, opts.speed );
				
				// after animation finishes
				// 		1) remove item
				//		2) return padding to '0px'
				// 		3) return positioning to '0px'
				//		4) begin animating any queued items
				setTimeout( function() {
					item.remove();
					setHiddenSpaceSize( list, 0, 0 );
					processQueuedItems.call( $this );
				}, opts.speed + BUFFER_TIME );
			} else {
				// We are currently animating, queue up the pop command
				queue.push( "POP" );
			}
		});
	};
	
	// Set default options for the scrollbox
	jQuery.fn.scrollbox.defaults = {
		maxsize : 20,
		speed   : 500
	};
	
	// Private functions 
	function processQueuedItems( ) {
		var $this = this;
		var list = $this.find( 'ul' );
		
		if ( queue.length > 0 )
			if ( parseInt( list.css( 'top' ) ) == 0 ) {
				var item = queue.shift();
				
				if ( item == "POP" ) $this.scrollbox.pop();
				else                 $this.scrollbox.push( item );
			} else {
				setTimeout( function() { 
					processQueuedItems.call( $this ) 
				}, 100 );
			}
	};
	
	function setHiddenSpaceSize( list, top, padding ) {
		list.css( 'top', top + 'px' );
		list.css( 'padding-top', padding + 'px' );
	};
	
	jQuery.fn.scrollbox.size = function() {
	  return queue.length;
	};

// end closure
}) ( jQuery );