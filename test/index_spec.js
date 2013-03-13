var Overlay = component('overlay');

describe('Overlay', function(){

  beforeEach(function(){
    this.overlay = new Overlay();
  });

  afterEach(function(){
    this.overlay.remove();
  });

  it('should attach to the body', function(){
    expect($('body').find(this.overlay.el).length).to.equal(1);
  });

  it('should show', function(done){
    var overlay = this.overlay;
    this.overlay.show();
    setTimeout(function(){
      expect(overlay.el.hasClass('is-inactive')).to.equal(false);
      done();
    }, 0);
  });

  it('should hide', function(){
    this.overlay.hide();
    expect(this.overlay.el.hasClass('is-inactive')).to.equal(true);
  });

  it('should toggle a loading state', function(){
    this.overlay.loading(true);
    expect(this.overlay.el.hasClass('is-loading')).to.equal(true);
    this.overlay.loading(false);
    expect(this.overlay.el.hasClass('is-loading')).to.equal(false);
  });

  it('should hide on click', function(){
    this.overlay.show();
    this.overlay.el.click();
    expect(this.overlay.el.hasClass('is-inactive')).to.equal(true);
  });

  it('should be chainable', function(){
    this.overlay.show().hide().loading(true).loading(false).remove();
  });


});