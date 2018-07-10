<!-- 
.. title: Introduction to Reinforcement Learning
.. slug: introduction-to-reinforcement-learning
.. date: 2016-12-28 15:02:29 UTC+01:00
.. tags: mathjax
.. category: 
.. link: 
.. description: I'll describe what Reinforcement Learning is, where it's applicable, some of the key ideas and approaches behind it and some of the challenges faced when building an RL system.
.. type: text
-->


<script>
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

min_val = -1;
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
              vals[i][j] = policy[0]*(  vals_old[Math.max(i-1,0)][j]    -1)
                    +  policy[1]*(  vals_old[Math.min(i+1,ncols-1)][j]    -1)
                    +  policy[2]*(  vals_old[i][Math.max(j-1,0)]    -1)
                    +  policy[3]*(  vals_old[i][Math.min(j+1,nrows-1)]    -1)
            }
        }

    vals [0][4] = 0;

        vals_old = vals;
    draw_value(obj_v,vals)
    iter_pe+=1
    if (iter_pe<40)
      pe_id = setTimeout( update_eval_vals, 100 ,obj_v,policy,vals)
  }

  pe_gridworld= function (obj_f,obj_v,nrows,ncols) {
    if (pe_id!=-1){
      window.clearTimeout(pe_id); 
    }
    field = init_field(nrows,ncols,"-1");
    field [0][ncols-1] = "G";
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

    vals [0][4] = 0;

        vals_old = vals;
    draw_value(obj_v,vals)
    iter_vi+=1
    if (iter_vi<40)
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


 })(jQuery);  </script>



### "When a configuration is reached for which the action is undetermined, a random choice for the missing data is made and the appropriate entry is made in the description, tentatively, and is applied. When a pain stimulus occurs all tentative entries are cancelled, and when a pleasure stimulus occurs they are all made permanent." - Alan Turing (1948)


Reinforcement Learning deals with problems where an agent needs to learn to interact with its environment through a number of actions and try to maximise the total reward it gets over time. The core of it lies in the fact that the agent is not taught what actions to take when but has to discover this on its own through its repeated interactions with the environment. This feels natural to us since it's an integral part of how humans or animals learn and much of the techniques developed are inspired by Psychology and Neuroscience. 

RL is **huge** right now. It's changing the world around us with Self-Driving Cars, [beating professional gamers at retro games](http://www.nature.com/nature/journal/v518/n7540/full/nature14236.html), [Doom!](https://www.cmu.edu/news/stories/archives/2016/september/AI-agent-survives-doom.html), beating world champions at games considered impossible for computers to solve just years ago ([Go](https://deepmind.com/research/alphago/), [Backgammon](https://en.wikipedia.org/wiki/TD-Gammon), [Chess](http://spawk.fish/)), Quantitative Finance,[Making Data Centers more Energy Efficient](https://deepmind.com/blog/deepmind-ai-reduces-google-data-centre-cooling-bill-40/), [Robotics](https://www.youtube.com/watch?v=QxQKI1O2ep0) and so much more.

While most of the key concepts in Reinforcement Learning were decades ago, explosive success in Deep Learning has given a second wind to Reinforcement Learning and techniques combining them are often called Deep Reinforcement Learning. 

The goal of writing this introductory series of posts is to show how simple but powerful the key ideas in RL are and how easy it is to get an understanding of what the state of the art performing system as of last year was. I'll make it a point to explain the math as simply and intuitively as I possibly can and luckily, a lot of the math behind RL is very easy to understand through visualization. Before I actually start with anything, I'd like to point out that if you'd like to know more about Reinforcement Learning, [Sutton & Barto's Book on RL](https://webdocs.cs.ualberta.ca/~sutton/book/the-book.html) is very approachable even without too much background knowledge and considered a bible. I'll be using this book heavily throughout. I'll also be sticking to their notation since it's popular and will hopefully be easier to look things up from there when it's needed.

# The Reinforcement Learning Problem

Reinforcement Learning solves a class of problems where an agent needs to learn to interact with the environment through a number of actions it can perform in order to maximize its total reward and achieve its goal.

<img src="/img/rl_components.png">

In the typical game scenario like Mario, Mario's the agent and what we see on screen is the environment. The 4 keys for movement as well as the "a" and "b" keys are actions to the game as well as "do nothing". The agent interacts with the environment by picking some actions to perform at every time step and this changes his state and gives him some rewards. Positive rewards can be in the form of an increase in score and a large negative reward for the loss of life or a game-over. We could also set a small negative reward for time taken to encourage our agent to finish the round as quickly as possible.

Let's look at the typical components of an RL system in the context of a simple environment often called gridworld.

* **State ($s$)**: The state is the what the agent can observe of an environment. It's the data the agent has to make its decisions based on. Typically, this consists of things like sensor readings in robotics or plain images. In a simple example shown below, we have our agent denoted by the blue ball in the maze with the end state in green. This entire maze and all the pieces in it denotes the state of the game and describes what the agent sees. 

<img src="/img/rl_intro/state.png" width="200px" height ="200px">

* **Action ($a$)**: An action a is one of the possible actions that the agent can perform. The example below shows the agent can choose either to move North, South, East or West.

<img src="/img/rl_intro/action.png" width="200px" height ="200px">

* **Reward Function ($R^a_{ss'}$) and Reward Signal ($r$)**: At every time-step, the agent receives a reward signal ($r$) from the environment. This reward signal is some number the agent receives as it's reinforcement- either positive or negative, to decide whether something it's doing is good or bad. In our little maze, we get a reward of +1 for moving from some state to the goal state (in green) and a 0 for everything else. This +1 reward, therefore, needs to incentivise the agent to get to that goal state somehow since that's the only way to get the reward. Mathematically, the reward function $R^a_{ss'}$ generates a reward signal $r$ when the agent moves from state $s$ to $s'$ while performing the action $a$

<img src="/img/rl_intro/reward.png" width="200px" height ="200px">

* **State-Transition Function($P^a_{ss'}$)**: A state transition function governs how an agent in one state goes to the next when it performs a particular action. This state transition function is either deterministic where an action always takes you to that same state or is stochastic to model games of chance like the probability of drawing a particular card in Poker or a dice roll. This includes situations like "Opening treasure chest has a 20% chance of getting you the key". Abstractly, this would be represented like: **$P$(near_chest,open_treasure,got_key) = 0.2**.

The Reward Function and the State-Transition Function are typically part of the Environment Dynamics and may not be directly accessible by the agent.

* **Policy ($\pi$)**: The aim of an RL algorithm is to find a Policy that tells the agent how to act given a state. An agent keeps trying to find a better policy that allows it to get more reward in the long-term. It does this by looking at which one of its actions are more likely to produce high reward and prefers those over lower ones.

With these values defined, we can visualize one time-step as a tree of possible agent interactions with the environment. This will help us understand something called backup diagrams we'll look at later and makes it easier to see how all of these values come together.


<script src="/js/cytoscape.min.js"> </script>
<div id="cy"></div>
<style type="text/css">
#cy {
  height: 500px;
}

#cy2 {
  height: 500px;
}

#cy3 {
  height: 500px;
}

</style>
<script>
$(function(){ // on dom ready
var cy = cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,
  autounselectify: true,
  zoomingEnabled: false,
  panningEnabled: false,
  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(id)',
        'background-color': '#000000',
        'width':'data(size)',
        'height':'data(size)',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',

      })
    .selector('edge')
      .css({
        'target-arrow-shape': 'triangle',
        'width': 4,
        'line-color': '#ddd',
        'target-arrow-color': '#ddd',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'color': '#FFFFFF',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',
        'font-size':'12px'

      })
    .selector('.highlighted')
      .css({
        'border': '10px solid #61bffc',
        'line-color': '#61bffc',
        'target-arrow-color': '#61bffc',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',
        'color': '#000000',
        'background-color': '#61bffc',
        'z-index': '9999',
      })
    .selector('.multiline-manual')
    .css({
        'text-wrap': 'wrap',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',      
    }),
  elements: {
      nodes: [
        { data: { id: 's', size: '24px' } },
        { data: { id: 'N', size: '12px' } },
        { data: { id: 'S', size: '12px' } },
        { data: { id: 'E', size: '12px' } },
        { data: { id: 'W', size: '12px' } },

        { data: { id: 's11', size: '24px' } },
        { data: { id: 's12', size: '24px' } },

        { data: { id: 's21', size: '24px' } },
        { data: { id: 's22', size: '24px' } },

        { data: { id: 's31', size: '24px' } },
        { data: { id: 's32', size: '24px' } },

        { data: { id: 's41', size: '24px' } },
        { data: { id: 's42', size: '24px' } }
      ], 
      
      edges: [
        { data: { id: 'a1', label: 'π(s,N)', weight: 1, source: 's', target: 'N' } },
        { data: { id: 'a2', label: 'π(s,S)', weight: 2, source: 's', target: 'S' } },
        { data: { id: 'a3', label: 'π(s,E)', weight: 3, source: 's', target: 'E' } },
        { data: { id: 'a4', label: 'π(s,W)', weight: 4, source: 's', target: 'W' } },

        { data: { id: 'a1s11', label: 'P(s,s11)\nR(s,N,s11)', weight: 6, source: 'N', target: 's11' },classes: 'multiline-manual' },
        { data: { id: 'a1s12', label: 'P(s,s12)\nR(s,N,s12)', weight: 6, source: 'N', target: 's12' },classes: 'multiline-manual' },

        { data: { id: 'a2s21', label: 'P(s,s21)\nR(s,S,s21)', weight: 7, source: 'S', target: 's21' },classes: 'multiline-manual' },
        { data: { id: 'a2s22', label: 'P(s,s22)\nR(s,S,s22)', weight: 7, source: 'S', target: 's22' },classes: 'multiline-manual' },


        { data: { id: 'a3s31', label: 'P(s,s31)\nR(s,E,s31)', weight: 8, source: 'E', target: 's31' },classes: 'multiline-manual' },
        { data: { id: 'a3s32', label: 'P(s,s32)\nR(s,E,s32)', weight: 8, source: 'E', target: 's32' },classes: 'multiline-manual' },

        
        { data: { id: 'a4s41', label: 'P(s,s41)\nR(s,W,s41)', weight: 9, source: 'W', target: 's41' },classes: 'multiline-manual' },
        { data: { id: 'a4s42', label: 'P(s,s42)\nR(s,W,s42)', weight: 9, source: 'W', target: 's42' },classes: 'multiline-manual' },

      ]
    },
  layout: {
    name: 'breadthfirst',
    directed: true,
    roots: '#s',
    padding: 10
  }
});
  

function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

var bfs = cy.elements().bfs('#s', function(){}, true);

var curnode = bfs.path[0].data().id
bfs.path[0].addClass('highlighted');

var curpath = undefined; 
var highlighted = [];

var highlightNextEle = function(){
    if (curpath==undefined){
        //Pick a new path 
        var choices = [];
        for (var i = 0; i <  bfs.path.length; i++) {
            if(bfs.path[i].data().source==curnode) 
                choices.push(i);
        }
        if (choices.length>0){
            curpath = choose(choices);
            bfs.path[curpath].addClass('highlighted');
            highlighted.push(curpath);
            curnode = bfs.path[curpath].data().target;
             kekeke = bfs.path[curpath];


        }else{
                curnode = bfs.path[0].data().id
                curpath = undefined; 
                for (var i = 0; i <  highlighted.length; i++) {
                    bfs.path[highlighted[i]].removeClass('highlighted');
                    bfs.path[highlighted[i]].css('line-color','#ddd');
                    bfs.path[highlighted[i]].css('background-color','#000');
                    bfs.path[highlighted[i]].css('target-arrow-color','#ddd');
                }   
                highlighted = [];
        }   

    }else{
        curnode_index = -1;
        for (var i = 0; i <  bfs.path.length; i++) {
            if(bfs.path[i].data().id==curnode) 
                curnode_index = i;
        }
        bfs.path[curnode_index].addClass('highlighted');    
        highlighted.push(curnode_index);
        curpath = undefined;

    }

};

// kick off first highlight
// highlightNextEle();
 window.setInterval(highlightNextEle, 500);

}); // on dom ready
</script>

We can see from the above figure that an agent in state s picks an action a (either N, S, E, W) with a probability given by the policy $\pi$ it's following. Based on the Environment Dynamics (State Transition Function), the agent can end up in one of two states for each action and receive a reward for the transition. To make things a little more formal, this setup is based on something called Markov Decision Processes (or MDP). Like we mentioned above, an MDP has a set of possible states, actions, rewards for being in a state and performing an action and the probability of transitioning from one state to the next given an action was performed. Below is the typical representation of an MDP.

<figure>
<img src="/img/rl_intro/mdp.png" width="350px">
<figcaption>Markov Decision Process</figcaption>
</figure>


As mentioned before, the end goal of this is to derive a policy and there are a couple of ways it can be done. We can either estimate it directly (by estimating a Policy Function using Policy Gradient Methods) or indirectly (by finding intermediate functions and deriving a policy from that). We'll first look at the indirect way to solve this MDP and find the optimal behaviour by estimating something called a value function.

## Value Function ($v$)

A value function is a measure of how "good" a state is. Given a state $s$ and you're following a policy $\pi$, it's value $v^{\pi}(s)$ is the *expected total reward* of being in that state. In other words, The value of the state is the total amount of reward an agent can expect to accumulate over time starting from that state.

Since I mentioned the term *Expected total reward*, let's take a quick look at what an *Expected Value* from Probability Theory is. Suppose a random variable X can take value $x_1$ with probability $p_1$, value $x_2$ with probability $p_2$, and so on, up to value $x_k$ with probability $p_k$. Then the expectation of this random variable X is given by 

\begin{equation}
\operatorname{E}[X] = \sum_{i=1}^\infty x_i\, p_i 
\end{equation}

Simply put, consider a game where I win \$2 whenever I roll a 6 with a dice and lose \$0.5 for every other number, my *Expected Value* or the value of money I expect to win/lose if I keep playing for a long, long time is simply the sum of values multiplied by the probability it occurs. For this example, it would be $2$x$\frac{1}{6}+(-0.5$x$\frac{5}{6})=-0.833$ so it probably doesn't make sense to play the game.

Going back to the Value Function, it's represented by this complicated looking but surprisingly simple equation:

\begin{equation}
v^{\pi} (s) = \sum_{a \in A} \pi(a|s) (\sum_{s'\in S} P^a_{ss'}(R^a_{ss'} + \gamma v^{\pi}(s'))
\end{equation}

The first $\sum_{a \in A} \pi(a|s)$ term is just a way of representing the fact that we have multiple actions we can perform and the probability of picking an action given the current state is given by the policy($\pi$) we're currently following. This represents the first level of the backup diagram shown below.

The next $\sum_{s'\in S} P^a_{ss'}$ part is a way of saying there are multiple states we could end up in after we've picked our action (for stochastic environments) and the State Transition Function gives us a probability assigned to each of the possible target states. This is represented by the second level of the backup diagram.

Let's put aside the summation for now and focus on just one of these values. The multiplication of the terms $\pi(a|s)$ and $P^a_{ss'}$ gives us the probability of starting in some state $s$, picking an action $a$ and ending up in state $s'$. This gives us the "$p_i$"s to calculate the expected value.

Now, the term $(R^a_{ss'} + \gamma v^{\pi}(s'))$ is the essentially the reward received in transitioning from $s \rightarrow s'$ (while picking the action $a$) and the value at that new state $v^{\pi}(s')$. Put another way, this sum is the total reward I get for going to this new state and all the future rewards I can get from being in that new state. With this, we have the "$x_i$"s needed to calculated the expected value.

Now all that's left for the $\operatorname{E}[X]$ calculation is the $\sum_{i=1}^\infty$ part and that's what the summation term $\sum_{a \in A}$ is for. This is simpler to see in the gridworld but this whole procedure is actually just saying a state is as good as the reward we get from moving to the neighboring cells and all the rewards we can get from then onwards. 

Lastly, the $\gamma$ term is what's called a discount factor. It's a mechanism to weigh the importance of immediate rewards vs rewards far off in the future. A value close to 1 would imply we care about the long-term expected reward while a value closer to 0 means we care more about immediate rewards.

It helps to visualize this process in two stages. One, we look at all the possible states we can end up in (shown in blue below) and then take all those values and "back" them up to the current state (shown in red).

<div id="cy2"></div>
<script>
$(function(){ // on dom ready
var cy2 = cytoscape({
  container: document.getElementById('cy2'),

  boxSelectionEnabled: false,
  autounselectify: true,
  zoomingEnabled: false,
  panningEnabled: false,
  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(id)',
        'background-color': '#000000',
        'width':'data(size)',
        'height':'data(size)',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',

      })
    .selector('edge')
      .css({
        'target-arrow-shape': 'triangle',
        'width': 4,
        'line-color': '#ddd',
        'target-arrow-color': '#ddd',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'color': '#FFFFFF',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',
        'font-size':'10px'

      })
    .selector('.highlighted')
      .css({
        'border': '10px solid #61bffc',
        'line-color': '#61bffc',
        'target-arrow-color': '#61bffc',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',
        'color': '#000000',
        'background-color': '#61bffc',
        'z-index': '9999',
      })
     .selector('.highlighted_back')
      .css({
        'border': '10px solid #F34213',
        'line-color': '#F34213',
        'target-arrow-color': '#F34213',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',
        'color': '#000000',
        'background-color': '#F34213',
        'z-index': '9999',
        'text-align':'left'
      })

    .selector('.multiline-manual-left')
    .css({

        'text-wrap': 'wrap',
        'text-align':'left'
    })
    .selector('.multiline-manual-right')
    .css({
        'text-wrap': 'wrap',
        'text-align':'right'
    }),
  elements: {
      nodes: [
        { data: { id: 's', size: '24px',level:2 } },
        { data: { id: 'N', size: '12px' ,level:3} },
        { data: { id: 'S', size: '12px' ,level:3} },
        { data: { id: 'E', size: '12px' ,level:3} },
        { data: { id: 'W', size: '12px' ,level:3} },

        { data: { id: 's11', size: '24px', level:3 } },
        { data: { id: 's12', size: '24px', level:3 } },

        { data: { id: 's21', size: '24px', level:3 } },
        { data: { id: 's22', size: '24px', level:3 } },

        { data: { id: 's31', size: '24px', level:3 } },
        { data: { id: 's32', size: '24px', level:3 } },

        { data: { id: 's41', size: '24px', level:3 } },
        { data: { id: 's42', size: '24px', level:3 } }
      ], 
      
      edges: [
        { data: { id: 'a1', label: 'π(s,N)', weight: 1, source: 's', target: 'N', level:2 } },
        { data: { id: 'a2', label: 'π(s,S)', weight: 1, source: 's', target: 'S', level:2 } },
        { data: { id: 'a3', label: 'π(s,E)', weight: 1, source: 's', target: 'E', level:2 } },
        { data: { id: 'a4', label: 'π(s,W)', weight: 1, source: 's', target: 'W', level:2 } },

        { data: { id: 'a1s11', label: 'P(s, s11)\n R(s, s11, N)', weight: 6, source: 'N', level:3 ,target: 's11' },classes: 'multiline-manual-left' },
        { data: { id: 'a1s12', label: 'P(s, s12)\n R(s, s12, N)', weight: 6, source: 'N', level:3 ,target: 's12' },classes: 'multiline-manual-right' },

        { data: { id: 'a2s21', label: 'P(s, s21)\n R(s, s21, S)', weight: 7, source: 'S', level:3 ,target: 's21' },classes: 'multiline-manual-left' },
        { data: { id: 'a2s22', label: 'P(s, s22)\n R(s, s22, S)', weight: 7, source: 'S', level:3 ,target: 's22' },classes: 'multiline-manual-right' },


        { data: { id: 'a3s31', label: 'P(s, s31)\n R(s, s31, E)', weight: 8, source: 'E', level:3 ,target: 's31' },classes: 'multiline-manual-left' },
        { data: { id: 'a3s32', label: 'P(s, s32)\n R(s, s32, E)', weight: 8, source: 'E', level:3 ,target: 's32' },classes: 'multiline-manual-right' },

        
        { data: { id: 'a4s41', label: 'P(s, s41)\n R(s, s41, W)', weight: 9, source: 'W', level:3 ,target: 's41' },classes: 'multiline-manual-left' },
        { data: { id: 'a4s42', label: 'P(s, s42)\n R(s, s42, W)', weight: 9, source: 'W', level:3 ,target: 's42' },classes: 'multiline-manual-right' },

      ]
    },
  layout: {
    name: 'breadthfirst',
    directed: true,
    roots: '#s',
  }
});
  

var valiter = cy2.elements().bfs('#s', function(){}, true);
var val_level = 0;

var val_highlightNextEle = function(){
    for (var i = 0; i <  valiter.path.length; i++) 
        if (valiter.path[i].data().level==val_level){
                valiter.path[i].addClass('highlighted_back');
            }


    if (val_level==0){
        for (var i = 0; i <  valiter.path.length; i++){
            valiter.path[i].removeClass('highlighted');
            valiter.path[i].removeClass('highlighted_back');
            valiter.path[i].css('line-color','#ddd');
            valiter.path[i].css('background-color','#000');
            valiter.path[i].css('target-arrow-color','#ddd');
        }
    }

    if (val_level==-1){
      for (var i = 0; i <  valiter.path.length; i++){
            valiter.path[i].removeClass('highlighted_back');
            valiter.path[i].addClass('highlighted');
        }
      val_level=5;

    }


    val_level+=-1;

};

 window.setInterval(val_highlightNextEle, 1000);

}); 
</script>

To see how this actually works in action, let's describe a game that was partially introduced already - gridworld. As the name suggests, it's simply a 2D **n**x**n** grid where the agent occupies one position of the grid. At each point, there are 4 possible actions- North, South, East or West. The agent starts off in one of these cells and needs to reach the goal state for which it receives a +1 reward.In our gridworld, we know exactly where we'll end up if we try going North so $P^a_{ss'}$=1 for that $s'$ and 0 for everything else. We can simplify the equation to reflect this by

\begin{equation}
v^{\pi} (s) = \sum_{a \in A} \pi(a|s) (R^a_{ss'} + \gamma v^{\pi}(s'))
\end{equation}

One thing to note is the fact the definition of v uses the v of it's neighbors i.e- it's recursive and as we require for all recursive definitions, we need an initial value for the Value Function. Typically, we just initialize all the values with zeros and run this formula over and over again for every state and eventually, we'll reach a point where the values don't change much from one iteration to the next and this we consider is the Value Function of the environment. We can see how these values initialize and propagate in the Policy Evaluation section below.

# Policy Evaluation
Policy Evaluation is a way to evaluate an already known policy and see how well you'd perform following it. It's a direct application of the above value function equation. This is a simplistic example to show how values propagate over time and slowly converge towards their true values in gridworld.  

<div style="width:500px;margin-left: auto;margin-right: auto;">

    <div id="gw_v" style="width:300px;margin-left: auto;margin-right: auto;margin-bottom: 5px"></div>


    <table cellpadding=0 cellspacing=0 style="table-layout:fixed;width:185px;margin-left: auto;margin-right: auto">
    <tr> <td colspan="3" style="text-align:center">Policy </td></tr>
    <tr> <td> </td> <td style="text-align:center"> <input style="border: 0px" onchange='pe_gridworld($("#gw_f"),$("#gw_v"),5,5)' size=4 type="text" id="pe_up" value="0.25"> </td> <td> </td> </tr> 
    <tr> <td style="text-align:center"> <input style="border: 0px" onchange='pe_gridworld($("#gw_f"),$("#gw_v"),5,5)' size=4 type="text" id="pe_left" value="0.25"> </td> <td> </td> <td style="text-align:center"> <input style="border: 0px" onchange='pe_gridworld($("#gw_f"),$("#gw_v"),5,5)' size=4 type="text" id="pe_right" value="0.25"> </td></tr>
    <tr> <td> </td> <td style="text-align:center"> <input style="border: 0px" onchange='pe_gridworld($("#gw_f"),$("#gw_v"),5,5)' size=4 type="text" id="pe_down" value="0.25"> </td><td> </td> </tr> 
    </table>


    <div style="width:400px;margin-left: auto;margin-right: auto">

      <span class="bton" style="margin-bottom:0px" onclick="$('#pe_up').val('0.25');$('#pe_down').val('0.25');$('#pe_left').val('0.25');$('#pe_right').val('0.25');pe_gridworld($('#gw_f'),$('#gw_v'),5,5)">Uniform Random</span>
      <span class="bton" style="margin-bottom:0px" onclick="$('#pe_up').val('1');$('#pe_down').val('0');$('#pe_left').val('0');$('#pe_right').val('0');pe_gridworld($('#gw_f'),$('#gw_v'),5,5)">Always Up</span>
      <span class="bton" style="margin-bottom:0px" onclick="$('#pe_up').val('0');$('#pe_down').val('0');$('#pe_left').val('0');$('#pe_right').val('1');pe_gridworld($('#gw_f'),$('#gw_v'),5,5)">Always Right</span>

    </div>

<div style="font-size:10px;width:600px;margin-left: auto;margin-right: auto">The Uniform Random Policy is the default value and shows you the value of every state if you randomly pick one of your 4 options every time with equal probability. Note: You can edit these values at will. They are normalized to a [0,1] range and taken as probabilities. The computation will only run for 40 iterations. </div> 


</div>

A code snippet to see how Policy Evaluation can be implemented in Python is given below:

<span class="bton" style="margin-bottom:0px" onclick="$('#pol_eval_code').toggle(0.5);">Show/Hide Code</span>
<div id = "pol_eval_code">

```python
def evaluate_policy(policy):
    '''
    Policy evaluation implementation. 
    Checks for tolerance by looking at the maximum difference between values from one iteration to the next.
    '''
    V = np.zeros(MAP.shape,dtype=np.float32) #Initialize the Values to zero with the size of the map
    maxdiff = tol+1 
    while maxdiff>tol:
        maxdiff=0.
        for src in states:
            (y,x) = src
            if not is_valid_location(src): continue #Don't evaluate for blocked squares
            v = 0 
            for a in get_valid_actions(src): #Iterate through all possible actions from current state
                for target in [(y,x+1),(y,x-1),(y-1,x),(y+1,x)]: #Iterate through all possible end states
                    if is_valid_location(target): 
                        v+= policy[src][a]*P(target,a,src)*(R(target,a,src)+gamma*V[target[0],target[1]])
            maxdiff = max(maxdiff,abs(V[y,x]-v))
            V[y,x] = v #Set V to the updated value.
    return V
```
</div>

# Policy Iteration
Now that we've evaluated our policy, what can we do with it? Since our end goal is to find the best policy, we can make use of this evaluated policy to generate a new policy out of it. We can do this by simply looking at the value function above and at each state, picking the action that will take us to the neighbor with the best value. This is often called acting "greedily" with respect to the policy that we evaluated.  

To improve our policy further, we can go for another round of process described above. We can evaluate the greedy policy that we generated and again generate a new (and better) one. This process is known as Policy Iteration. It's shown that this process will eventually converge to the optimal policy $\pi^*$. 


<figure>
<img src="/img/rl_intro/policy_iter.png">
<figcaption>Policy Iteration. Image Credits: Sutton &amp; Barto</figcaption>
</figure>


A code snippet to see how Policy Iteration can be implemented in Python is given below:

<span class="bton" style="margin-bottom:0px" onclick="$('#pol_iter_code').toggle(0.5);">Show/Hide Code</span>
<div id="pol_iter_code">
```python
def derive_greedy_policy(V):
    '''
    Derive a greedy policy from the Value Function V
    '''
    Pol = {}
    for src in states:
        (y,x) = src
        maxval = -99 #Initialize with some min value.

        #Evaluate all the actions and find the one with the maximum value.
        for a in get_valid_actions(src): 
            for target in [(y,x+1),(y,x-1),(y-1,x),(y+1,x)]:
                if is_valid_location(target):
                    cval = P(target,a,src)*(R(target,a,src)+gamma*V[target[0],target[1]])
                    if cval>maxval: maxval,maxaction = (cval,a) 

        #Select the action greedily
        Pol[(y,x)]={'east':0.,'west':0.,'north':0.,'south':0.}
        Pol[(y,x)][maxaction] = 1.

    return Pol

def policy_iteration(Pol):
    '''
    Drive the Policy Iteration by calling evaluation and improvement till convergence 
    '''
    while True:

        V = evaluate_policy(Pol)

        Pol_new = derive_policy(V)

        if Pol_new == Pol:
            print("Policy Iteration converged after",i,"steps")
            break

        Pol = Pol_new

    return V
```

</div>

# Value Iteration
One way to speed up the above process if we don't need to explicitly derive a policy at each step is to combine the policy evaluation and picking of the greedy action into one like below:
\begin{equation}
v (s) = \max_{a \in A} \sum_{s'\in S} P^a_{ss'} [R^a_{ss'} + \gamma v_{\*}(s') ]
\end{equation}
This is known as Value Iteration. It can be noticed that it does produce final values similar to policy iteration 

<div id="gw_vi" style="margin-left: auto;margin-right:auto;width:300px"></div>
<script>
pe_gridworld($('#gw_f'),$('#gw_v'),5,5);
vi_gridworld($('#gw_vi'),5,5);
</script>


# Model-Based RL &amp; Model-Free RL

The above method works well and has some nice optimality guarantees but has one major limiting factor: It assumes knowledge about the Reward Function(R) and the State Transition Probability(P). Methods like this which either already have access to or try to learn the environment dynamics and then derive a policy from that are known as Model-Based RL. 

Model-Free RL on the other hand directly tries to estimate a measure such as the value function based only on the samples it collected from interaction with the environment without trying to model the environment explicitly. Model-free methods usually come in two major types - Value-Based RL and Policy-Based RL. Value-Based RL tries to learn a value function like above and Policy-Based RL methods try to directly learn a policy from the environment. 

Model-Based methods have the advantage of enabling planning by allowing us to use our model of the environment to "look ahead" and see what consequence an action has. However, these are much harder to learn in practice and might not even be possible to model for large, complex systems.

Model-free methods have the advantage of not requiring knowledge of the Environment and are not tied down by how well we can capture these potentially complex environment dynamics. That makes them much simpler to implement and are used much more in practice. However, these methods come at a cost of being purely reactive making high-level planning harder and not being very efficient in using samples collected in interactions with the environment.

One of the most popular ways to do Model Free RL is through a family of methods called Temporal Difference (TD) learning. We'll look at one such TD algorithm called Q-Learning.


#Q-Learning
First, let's look at the central idea behind TD learning using one the simplest methods- TD(0).

\begin{equation}
v(s) = v(s) + \alpha [(R_{s'}+\gamma v(s')) - v(s) ]
\end{equation}

Just like before, the equation starts to make a lot of sense when we start to visualize it. In this case, we do what's called *sample backups* rather than a *full backup* because we look at just one target state rather than all the possible target states.

<div id="cy3"></div>
<script>
$(function(){ // on dom ready
var cy3 = cytoscape({
  container: document.getElementById('cy3'),

  boxSelectionEnabled: false,
  autounselectify: true,
  zoomingEnabled: false,
  panningEnabled: false,
  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(id)',
        'background-color': '#000000',
        'width':'data(size)',
        'height':'data(size)',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',

      })
    .selector('edge')
      .css({
        'target-arrow-shape': 'triangle',
        'width': 4,
        'line-color': '#ddd',
        'target-arrow-color': '#ddd',
        'curve-style': 'bezier',
        'label': 'data(label)',
        'color': '#FFFFFF',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',
        'font-size':'10px'

      })
    .selector('.highlighted')
      .css({
        'border': '10px solid #61bffc',
        'line-color': '#61bffc',
        'target-arrow-color': '#61bffc',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',
        'color': '#000000',
        'background-color': '#61bffc',
        'z-index': '9999',
      })
     .selector('.highlighted_back')
      .css({
        'border': '10px solid #F34213',
        'line-color': '#F34213',
        'target-arrow-color': '#F34213',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s',
        'color': '#000000',
        'background-color': '#F34213',
        'z-index': '9999',
        'text-align':'left'
      })

    .selector('.multiline-manual-left')
    .css({

        'text-wrap': 'wrap',
        'text-align':'left'
    })
    .selector('.multiline-manual-right')
    .css({
        'text-wrap': 'wrap',
        'text-align':'right'
    }),
  elements: {
      nodes: [
        { data: { id: 's', size: '24px',level:2 } },
        { data: { id: 'a', size: '12px' ,level:2} },
        { data: { id: 's\'', size: '24px', level:3 } },

      ], 
      
      edges: [
        { data: { id: 'a1', label: '', weight: 1, source: 's', target: 'a', level:2 } },

        { data: { id: 'a1s11', label: 'V(s\')\n R(s, a, s\')', weight: 6, source: 'a', level:3 ,target: 's\'' },classes: 'multiline-manual-left' },

      ]
    },
  layout: {
    name: 'breadthfirst',
    directed: true,
    roots: '#s',
  }
});
  
var td0 = cy3.elements().bfs('#s', function(){}, true);


var td0_val_level = 4;
var td0_highlightNextEle = function(){
    for (var i = 0; i <  td0.path.length; i++) 
        if (td0.path[i].data().level==td0_val_level){
                td0.path[i].addClass('highlighted_back');
            }


    if (td0_val_level==0){
        for (var i = 0; i <  td0.path.length; i++){
            td0.path[i].removeClass('highlighted_back');
            td0.path[i].css('line-color','#ddd');
            td0.path[i].css('background-color','#000');
            td0.path[i].css('target-arrow-color','#ddd');
        }
        td0_val_level=4;
    }
    td0_val_level+=-1;

};
 window.setInterval(td0_highlightNextEle, 1000);

}); 
</script>

The core idea behind TD(0) is to make a prediction of what we think the value of that state is (denoted by the last term v(S) in the bracket) and a better estimate we get from our interaction with the environment (given by the term in the bracket $(R_{s'}+\gamma v(s'))$) and the difference between the two is called the TD error. TD error captures the change of prediction over time hence the name Temporal Difference Learning.   



We then update our estimate of the value of that state slightly towards the real measure. This "slightly" is represented by the factor $\alpha$ (usually smaller than one). This term is called the learning rate and controls how fast our estimate should move towards the current sample value. Having a high factor here would seem like a good idea since that means we'd immediately change our estimate to the newer one that we got from the sample but that leaves the system susceptible to noise. If the reward signal was noisy as it often is in real life, we'd keep changing the value estimates drastically every step and make it very hard for the system to converge to a stable value. 



Next, let's take a look at what the Q in the Q-Learning stands for. Q is called the Action-Value function and is very similar to the Value Function(V) that we used above except Q takes as input a state and action pair and gives the expected reward for that. We can switch out the Value Function with the Action-Value function as shown below:





\begin{equation}
Q(s,a) = Q(s,a) + \alpha [(R_{s'}+\gamma \max_{a^\star} Q(s',a^\star)) -Q(s,a) ]
\end{equation}




The only difference we notice in the $ \max_{a^\star} Q(s',a^\star) $ . Since it's not as simple as taking the Value of the next state since we have one Q value for every action at the state $s'$. To solve this, we pick the action $a^\star$ that leads to the best Q-value for that state.

A code snippet to see how Q-Learning can be implemented in Python is given below:

<span class="bton" style="margin-bottom:0px" onclick="$('#q_learning_code').toggle(0.5);">Show/Hide Code</span>
<div id = "q_learning_code">

```Python
def choose_action(state,eps=0.1):
    '''
    Choose an action using epsilon-greedy. 
    Perform a random action with probability of eps or pick the best action otherwise
    '''
    if np.random.uniform()>=eps:
        return np.argmax(Q[state[0],state[1],:])
    else:
        return np.random.choice(actions)

def q_step(s):
    '''
    Perform one step of the Q Learning. 
    '''

    #Choose an action epsilon greedily
    a = choose_action(s)
    
    #Perform the action and get the next state and reward
    s_new,r = perform_action(a)
    
    #Update the Q value
    Q[s[0],s[1],a]+= alpha*(r+gamma*np.max(Q[s_new[0],s_new[1],:])-Q[s[0],s[1],a])
    
    episode_ended = is_episode_end(s_new)

    return s_new,episode_ended
```

</div>

# Deep Reinforcement Learning

While methods above work well and some actually have proofs that they'll eventually find the optimal policy out of it, it comes at a cost. It's often not feasible to store everything in the form of a table. For a simple, for the game of Go, there are an estimated $10^{170}$ number of states and at a given time and an estimated 150-250 possible actions to perform. In more real-world problems, it's often not even possible to quantify this. If we're to consider a self-driving car and simply look at the distance travelled as one value of the state, it's a continuous value. Are 1,1.1,1.111,1.11111 all different states? Even if we did have an infinite amount of memory to store all of these at the most granular level, we would still have to run all our algorithms a very large number of times so we've visited every single possible state multiple times so we update it's values even though it's very likely that the state 1,1.1,1.111,1.11111 are very similar to each other.



These lead to the use of function approximators where we try to find some sort of simpler way to represent these functions. Using Deep Neural Networks as Function approximators for Reinforcement Learning leads to what's popularly known as Deep Reinforcement Learning. While we're not going to get into it in this post, using a Deep Convolutional Neural Network to represent the Action-Value Function(Q) in the above Q-Learning algorithm along with a few tricks like Experience Replay, Multiple copies of the Q-Network and Reward Clipping to improve its sample efficiency and improve it's stability gets you to Google's Deep Q Network that was very popular and was the State of the Art on Atari just a year ago! To get a quick overview of this, I suggest watching <a href="http://videolectures.net/rldm2015_silver_reinforcement_learning/">  this </a>   tutorial which will introduce the concepts I just mentioned.



# Why is Reinforcement Learning so hard? 

It makes you wonder how we could *kinda almost* get to a point where we're capable of building what was considered State of the Art in 2015 after just enough information contained in this tiny blog post. It probably makes you wonder if there's anything to it in the first place. There's actually a lot of challenges that seem very subtle initially but on thinking about it a little more turn out to be the limiting factors of any RL system. A lot of research for past decades and even now is focused on addressing some of these and a lot of them are very interwoven.



## Credit Assignment

Credit assignment is one of the fundamental aspects that underpin the Reinforcement Learning setup. How do you distribute the credit for success or failure among all the decisions you've taken to reach the current point? One way to look at it is that this is fundamentally what RL is about in the first place- finding out which action you've performed led to winning the game and which one led to a car crashing into a wall. 



This problem is quite hard to address because we have no idea whether the move that made us lose a game of chess was the last one or the first opening move or somewhere in between. Or perhaps it was a number of bad decisions that were made along the way. If we're always propagating the TD error one step, it might take a long time before meaningful error signals actually reach the opening state and we might have played many games with that flawed opening by then wasting precious interactions with the environment. The solution to this would be to use a variant of the TD learning algorithm called TD($\lambda$). The $\lambda$ term refers to the use of something called an *eligibility trace*. Let's look in particular at the Backward View TD($\lambda$). This essentially uses two heuristics to help assign credit - *The Recency Heuristic* which aims to assign credit to states that were more recently visited and the Frequency Heuristic which helps assign credit to states we visit often. Both of them are succinctly represented by the following equations:



\begin{equation} E_0(S) = 0  \end{equation}
\begin{equation} E_t(S) = \gamma \lambda E_{t-1}(s) + 1(S_t=s) \end{equation}


\begin{equation} \delta_t =  R_{t+1}+\gamma v(s_{t+1}) -v(s_t) \end{equation}
\begin{equation} v(s) = v(s) + \alpha \delta_t E_t(S) \end{equation}




The first line is just an initialization of the eligibility trace to zero. The eligibility trace $E_t(s)$ introduces another term $\lambda$. This is similar to the Discount Factor but controls how far out in the future these traces should last. In other words, they control how quickly it decays with time and falls back down to zero. A value close to zero means it decays very quickly not allowing the error to propagate too far back while a trace close to 1 allows the error to propagate further back. 



The Eligibility trace for one state is given in the diagram below. The first part shows when our agent visited the state and the bottom shows the value of the eligibility trace. 



<img src="/img/rl_intro/traces.png">



The rest of the equation is the standard TD(0) algorithm other than the fact that we multiply this trace with the TD error (given by $\delta_t$)



## Exploration vs Exploitation

Decision making has a fundamental choice between *Exploiting* the knowledge we already have vs *Exploring* to gather more information. This problem is also one we must face when building RL systems. If we tend towards Exploiting what we already know often, we might not discover new ways of behaving that might lead to a better result. However, if we're always exploring, we might never end up actually profiting from the knowledge we gain. Finding a balance between the both is crucial to a successful system.



#### $\epsilon$-Greedy

A trade-off between Exploration and Exploitation by behaving greedily most of the time while occasionally picking a random exploratory action with probability $\epsilon$. This is one of the simplest ways to balance Exploration and Exploitation and is often used because of its simplicity and surprising power. Typical implementations of this strategy also start with a high $\epsilon$ value close to 1 and then slowly decrease it as training continues until we reach a minimum value. This is called the Decaying $\epsilon_t$-Greedy algorithm.



#### Boltzmann Exploration

A pitfall of the $\epsilon$-Greedy approach is that it treats all actions equally when selecting exploratory actions. This isn't always true. If we already know an action is truly bad, we might not want to explore it as much as other promising ones. One way to do this is picking actions with their probability values proportional to their Q values. 




\begin{equation}
Prob(a) = \frac{e^{\frac{Q(s,a)}{\tau}}} {e^{\sum_{a' \in A } \frac{Q(s,a')}{\tau} }}
\end{equation}


Where $\tau$ is called the temperature constant which weighs how much we should trust only the Q values. A high $\tau$ value will force the values to be more random while a value close to 0 ensures we behave almost greedily.


#### Optimistic Initialization

The idea here is to initialize all the action value functions to a value $r_{max}$ which is the maximum possible reward obtainable. This then biases the system to visit states it hasn't visited before since they're initialized with a high Q value.


#### Intrinsic Motivation

A hot topic of research right now is to find a way to intrinsically motivate an agent to explore. Extrinsic Motivation is received through the rewarding structure while Intrinsic Motivation is a way to encourage an agent simply driven by curiosity without any explicit reward. This can happen through ways like coming up with a reward for visiting a state we've never seen before.


## Hidden States &amp; The Markovian Assumption

Current RL systems are modelled as a Markov Decision Process as we've already discussed. One aspect of this we haven't mentioned yet is the Markovian Property. The Markov Property assumes that the past doesn't matter and that the next state only depends on the current one and not any of the ones in the past. Another way of putting this is that the current state tells you everything you need to know to make a decision and knowing the past won't help. This is a pretty strong assumption but it holds true for a surprising number situations. However, for many real-world situations, this Markov Assumption does not hold true and your current state is very closely related to what you did in the past.

Another important assumption made is that the world if fully observable. This means that the current state fully captures all the information we need in order to make a decision. Consider a simple extension of the gridworld but now, the goal spawns at one of the 4 corners of the map randomly and the agent can only sense a small portion around it. 


<center>

<img src="/img/rl_intro/aliased_1.png" width="200px" style="display:inline;margin-right:5px" />
<img src="/img/rl_intro/aliased_2.png" width="200px" style="display:inline;margin-right:5px" />
</center>

In the picture to the left, the agent can "see" only the 8 neighbouring cells and decides to go down and to the left following some policy in order to go to one of the corners. It then observes that it's hit a corner and the goal isn't here and leaves by trying to move up and towards the right. It's right back where it was before the whole thing started because it can only observe the world partially and cannot see that the goal is towards the other end. It also has no "memory" because of the Markovian Property and cannot reasonably expect to solve problems like this. One way to remedy this would be to explicitly add it memory or some extra information to its state like corners it's already visited but since we're interested in building general purpose AI, this wouldn't be fair.

## Defining a Reward Function
Defining a reward function is not always a straightforward task. Although we technically consider this a part of the environment, while creating a new task you want to solve through reinforcement learning, we need to define this reward function. In games like Atari or Mario, it's easier since we already have a score and lives that in a way provide feedback about how well the agent is doing. However, it's not as straightforward in a lot of real-world tasks.

Consider a task like teaching a robotic arm to pick up a glass of water without spilling it. We might think it's straightforward to just give a +1 reward when it performs the task perfectly and nothing else but consider the problem of credit assignment. The arm does hundreds and thousands of trials just flailing about not knowing what to do. Sometimes it touches the glass, sometimes it knocks over the glass. Finally, it picks up the glass but spills a bit of water so we don't give it the +1. The agent has no way of distinguishing this trail from all the other random actions it's done till now although it was pretty close to what we wanted and it will continue to flail about trying random actions trying to figure out what to do.

How do we fix this? For starters, we could say maybe we split up this complicated task into two and give it some positive reward for picking up the glass and a bigger one for not spilling water. Now, what about times it's touched the glass but hasn't picked it up? That's definitely closer to the ideal action of picking it up than waving the arm around. Now we could think about rewarding that slightly as well. Now this could go on and on. The more explicit we get in our reward specification and the more we hand engineer these, the more likely we are to solve the task at hand.

Then the question becomes, how much is too much? The more explicitly we specify these subgoals, the more we're programming it to behave in a particular way. This also leads to all kinds of other problems like *reward hacking* where an agent exploits some loophole in the reward function and finds some optimal behavior that maximizes it's reward that the programmer did not think about. For example, we might specify a small reward of 0.1 for touching the glass and a +1 for completing the task and the robot realizes that it can get more than the total +1.1 by just poking the glass continuously and that it gets a total of +1.2 just touching it 12 times.

Another way to look at this problem is through a game like chess. Typically, we have only one reward signal- either a +1 for winning or a -1 for losing. In game that lasts dozens of moves with an extremely large state space, realistically playing enough games to precisely get the credit of the win or the loss on one particular move that you made somewhere in the beginning isn't feasible so instead, rewards are based off some additional features like Piece Mobility and Piece Threats and so on. 

<center>
  <br>
  <hr width="30%">
  <br>

</center>
And that's a wrap for this super long intro post but I hope I did a good job giving you a sense of what RL's about and why it's challenging and so exciting! There's lots of fantastic work being done in the field and further posts are probably going to explore more of recent work and papers than introductions but we shall see :)

Please feel free to leave comments and feedback (and possibly requests). This is my first post after all and I know there's *lots* of room for improvement.

Links and Resources:

* [Reinforcement Learning: An Introduction - Sutton &amp; Barto](https://webdocs.cs.ualberta.ca/~sutton/book/the-book-2nd.html)
* [David Silver's RL Course](http://www0.cs.ucl.ac.uk/staff/d.silver/web/Teaching.html)
* [Andrej Karpathy's Deep Learning Course](https://cs231n.github.io/)
* [Berkley's Deep RL Course](http://rll.berkeley.edu/deeprlcourse/)
* [Nando de Freitas' ML Course](https://www.cs.ox.ac.uk/people/nando.defreitas/machinelearning/)


** Edited 2nd Jan, 2017: Rewrote the explanation for the Value Function since people said it was still a little confusing. **