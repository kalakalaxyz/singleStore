const express = require('express');
const Address = require('../../models/address');
const redis = require('../../lib/redis.js');
const router = express.Router();

router.post('/address/find', (req, res) => {
  	var obj = {delId: 0},
      	weiToken =  req.body.weiToken,
      	pageSize =  req.body.pageSize || 10,
      	currentPage =  req.body.currentPage || 1;
    redis.get(weiToken, function(err, data) {
    	console.log('weixin address weiToken data===');
    	console.log(data);
    	if(err) {
    		res.json({'success': false, 'data': err});
    	} else {
    		if(data) {
	    		obj.openid = data;
	    		Address.find(obj, {openid: 0}).sort({'created':-1}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
			    	if(error){
			      		res.json({'success': false, 'data': error});
			    	}else{
				      	Address.countDocuments(obj,function(err,result){
				        	res.json({'success': '查询成功', 'data': docs, 'total': result});
				      	});
			    	}
			  	});
		  	} else {
	          res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
	        }
    	}
    })
});

router.post('/address/findOne', (req, res) => {
  	var obj = {delId: 0},
      	weiToken =  req.body.weiToken;
    redis.get(weiToken, function(err, data) {
    	console.log('weixin address weiToken data===');
    	console.log(data);
    	if(err) {
    		res.json({'success': false, 'data': err});
    	} else {
    		if(data) {
	    		obj.openid = data;
	    		obj.state = 1;
	    		Address.findOne(obj, {openid: 0}).exec(function (error, docs) {
			    	if(error){
			      		res.json({'success': false, 'data': error});
			    	}else{
				        res.json({'success': '查询成功', 'data': docs});
			    	}
			  	});
		  	} else {
	          res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
	        }
    	}
    })
});

router.post('/address/createAndUpdate', (req, res) => {
  	var id = req.body._id,
		weiToken =  req.body.weiToken,
      	dataObj = {
	        name: req.body.name,
	        phone: req.body.phone,
	        addr: req.body.addr,
	        detailAddr: req.body.detailAddr,
	        tag: req.body.tag,
	        state: req.body.state
	    };
  	redis.get(weiToken, function(err, data) {
    	console.log('weixin address weiToken data===');
    	console.log(data);
    	if(err) {
    		res.json({'success': false, 'data': err});
    	} else {
    		if(data) {
    			dataObj.openid = data;
    			if(id) {
					Address.update({_id: id}, {$set: dataObj},function(error, docs){
					  	if(error){
					    	res.json({'success': false, 'data': error});
					  	}else{
					    	res.json({'success': '修改成功', 'data': docs});
					  	}
					});
			  	} else {
			    	Address.create(dataObj, function (error, docs) {
			      		if(error){
			        		res.json({'success': false, 'data': error});
			      		}else{
			        		res.json({'success': '新增成功', 'data': docs});
			      		}
			    	});
			  	}
    		} else {
	          res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
	        }
    	}
    })
});
//永久删除
router.post('/address/delete', (req, res) => {
  	var id = req.body._id,
  		weiToken =  req.body.weiToken;
  	redis.get(weiToken, function(err, data) {
    	console.log('weixin address weiToken data===');
    	console.log(data);
    	if(err) {
    		res.json({'success': false, 'data': err});
    	} else {
    		if(data) {
			  	if(id) {
			    	Address.remove({_id: id}, function(error){
			      		if(error){
			        		res.json({'success': false, 'data': error});
			      		}else{
			        		res.json({'success': true, 'data': '删除成功'});
			      		}
			    	})
			  	} else {
			    	res.json({'success': false, 'data': '无id'});
			  	}
  			} else {
	          	res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
	        }
    	}
    })
});
//删除标记
router.post('/address/delState', (req, res) => {
  	var id = req.body._id,
  		weiToken =  req.body.weiToken;
  	redis.get(weiToken, function(err, data) {
    	console.log('weixin address weiToken data===');
    	console.log(data);
    	if(err) {
    		res.json({'success': false, 'data': err});
    	} else {
    		if(data) {
			  	if(id) {
			    	Address.update({_id: id}, {$set: {delId: 1}},function(error, docs){
					  	if(error){
					    	res.json({'success': false, 'data': error});
					  	}else{
					    	res.json({'success': true, 'data': '删除成功'});
					  	}
					});
			  	} else {
			    	res.json({'success': false, 'data': '无id'});
			  	}
  			} else {
	          	res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
	        }
    	}
    })
});

router.post('/address/state', (req, res) => {
  	var id = req.body._id,
  		weiToken =  req.body.weiToken;
  	redis.get(weiToken, function(err, data) {
    	console.log('weixin address weiToken data===');
    	console.log(data);
    	if(err) {
    		res.json({'success': false, 'data': err});
    	} else {
    		if(data) {
			  	if(id) {
			    	Address.find({openid: data}, function(error, docs){
			      		if(error){
			        		res.json({'success': false, 'data': error});
			      		}else{
			        		docs.forEach(function(item,index,arr){
			        			item.state = 0;
			        			if(item._id == id) {
			        				item.state = 1;
			        			}
			        			item.save();
						    });
						    res.json({success: true, data: "state修改成功"});
			      		}
			    	})
			  	} else {
			    	res.json({'success': false, 'data': '无id'});
			  	}
  			} else {
	          	res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
	        }
    	}
    })
});

module.exports = router;
