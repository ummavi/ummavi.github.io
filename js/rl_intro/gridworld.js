var gridworld,vals,vals_old,pe_id;
pe_id = -1;
var vi_id = -1;
// init = rgb(0,4,40);
// final = rgb(0,78,146);
final_r = 0;
final_g = 78;
final_b = 146;

init_r = 0;
init_g = 4;
init_b = 40;

min_val = -60;
max_val = 0;

iter_pe=0;
(function($){

	init_field =function (nrows,ncols,val="rand"){
		//Initialize a 2d array with value val. 
		var arr = [];
		for(var i=0; i < nrows; i++){
		  arr[i]=new Array(ncols);
		  for(var j=0; j < ncols; j++){
		  	if(val=="rand")
		  		arr[i][j] =Math.random()
		  	else
		    	arr[i][j] = val;
		  }
		}
		return arr;
	}


	draw_field = function (obj,vals){
		nrows = vals.length
		ncols = vals[0].length
		var table = $('<table cellpadding=0 cellspacing=0 style="table-layout:fixed;width:300px;float:right;margin-top:10px"></table>').addClass('foo');
        for (var i = 0; i < nrows; i++) {
	                row = $('<tr></tr>');
	                for (var j = 0; j < ncols; j++) {
	                    var rowData = $('<td style="width:30px;height:50px;overflow:hidden;white-space:nowrap;text-align:center;"></td>').addClass('bar').text(vals[i][j]);
	                    row.append(rowData);
	                }
	                table.append(row);
	            }


        obj.html(table);


	}
	draw_value = function(obj,vals){
		nrows = vals.length;
		ncols = vals[0].length;
		min_val = 99999;
		max_val = -99999;
		for (var i = 0; i < nrows; i++) {
            for (var j = 0; j < ncols; j++) {
            	min_val = Math.min(min_val,vals[i][j]);
            	max_val = Math.max(max_val,vals[i][j]);
			}
		}		
		// Assume values from 0-1 from init to final. 
        var table = $('<table cellpadding=0 cellspacing=0 style="table-layout:fixed"></table>').addClass('foo');
        for (var i = 0; i < nrows; i++) {
	                row = $('<tr></tr>');
	                for (var j = 0; j < ncols; j++) {

	                	cur_r = init_r + Math.round(Math.round((final_r - init_r)*(Math.abs(min_val)+vals[i][j])/(max_val-min_val)));
	                	cur_g = init_g+ Math.round(Math.round((final_g - init_g)*(Math.abs(min_val)+vals[i][j])/(max_val-min_val)));
	                	cur_b = init_b+ Math.round(Math.round((final_b - init_b)*(Math.abs(min_val)+vals[i][j])/(max_val-min_val)));
	                    var rowData = $('<td style="width:30px;height:50px;overflow:hidden;white-space:nowrap;color:#FFFFFF;text-align:center;background-color:rgb('+cur_r+','+cur_g+','+cur_b+')"></td>').addClass('bar').text(Math.round(vals[i][j]*10)/10);
	                    row.append(rowData);
	                }
	                table.append(row);
	            }

        obj.html(table);
	      
	}

	update_eval_vals = function(obj_v,policy,vals_old){
		nrows = vals_old.length
		ncols = vals_old[0].length;

		vals = init_field(nrows,ncols,-9999)

        for (var i = 0; i < nrows; i++) {
            for (var j = 0; j < ncols; j++) {
            	vals[i][j] = policy[0]*(	vals_old[Math.max(i-1,0)][j]		-1)
            			  +  policy[1]*(	vals_old[Math.min(i+1,ncols-1)][j]		-1)
            			  +  policy[2]*(	vals_old[i][Math.max(j-1,0)]		-1)
            			  +  policy[3]*(	vals_old[i][Math.min(j+1,nrows-1)]		-1)
            }
        }

		vals [0][0] = 0;

        vals_old = vals;
		draw_value(obj_v,vals)
		iter_pe+=1
		if (iter_pe<100)
			pe_id = setTimeout( update_eval_vals, 100 ,obj_v,policy,vals)
	}

	pe_gridworld= function (obj_f,obj_v,nrows,ncols) {
		if (pe_id!=-1){
			window.clearTimeout(pe_id); 
		}
		field = init_field(nrows,ncols,"-1");
		field [0][0] = "G";
		draw_field(obj_f,field);

		//Grab the values entered.
		policy = [parseFloat($("#pe_up").val()),parseFloat($("#pe_down").val()),parseFloat($("#pe_left").val()),parseFloat($("#pe_right").val())];

		//Normalize the values 
		sum = policy[0]+policy[1]+policy[2]+policy[3]
		policy = [policy[0]/sum,policy[1]/sum,policy[2]/sum,policy[3]/sum];

		//Put them back into the input values 
		// $("#pe_up").val(policy[0])
		// $("#pe_down").val(policy[1])
		// $("#pe_left").val(policy[2])
		// $("#pe_right").val(policy[3])


		vals = init_field(nrows,ncols,0);		
		iter_pe = 0;
		vals = update_eval_vals(obj_v,policy,vals)
	}




	update_vals = function(obj_v,policy,vals_old){
		nrows = vals_old.length
		ncols = vals_old[0].length;

		vals = init_field(nrows,ncols,-9999)

        for (var i = 0; i < nrows; i++) {
            for (var j = 0; j < ncols; j++) {
            	vals[i][j] = Math.max(vals_old[Math.max(i-1,0)][j]-1,
            			   vals_old[Math.min(i+1,ncols-1)][j]-1,
            			   vals_old[i][Math.max(j-1,0)]-1,
            			   vals_old[i][Math.min(j+1,nrows-1)]-1)
            }
        }

		vals [0][0] = 0;

        vals_old = vals;
		draw_value(obj_v,vals)
		iter_vi+=1
		if (iter_vi<100)
			vi_id = setTimeout( update_vals, 100 ,obj_v,vals)
	}

	vi_gridworld= function (obj_v,nrows,ncols) {
		if (vi_id!=-1){
			window.clearTimeout(vi_id); 
		}

		vals = init_field(nrows,ncols,0);		
		iter_vi = 0;
		vals = update_eval_vals(obj_v,policy,vals)
	}


 })(jQuery); 