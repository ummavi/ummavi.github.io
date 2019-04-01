<!--
.. title: Supersizing Self-supervision: Learning to Grasp from 50K Tries and 700 Robot Hours
.. authors: Lerrel Pinto, Abhinav Gupta 
.. source: https://arxiv.org/abs/1509.06825 
.. slug: supersizing_selfsupervision
.. date: 2019-03-16 10:33:12 UTC+01:00
.. tags: 
.. description: Paper Summary of "Supersizing Self-supervision: Learning to Grasp from 50K Tries and 700 Robot Hours" by Pinto et. al [Arxiv: 1509.06825]
.. type: text
.. has_math: yes
.. category: notes
-->


## Key Ideas: 
* Learning-based robotic grasping that learns from trial-and-error experiments historically use small datasets that may lead to overfitting. Acquire create a dataset with 40x the data to train a CNN to predict grasp locations to generalize better on unseen objects.
* Recast $(x,y,\theta)$ as an 18-way binary classification task more suited for CNNs.
* Use multi-stage (curriculum) training to progressively improve its performance.


## Why is it difficult?
* Using 3D information often requires the fitting of a 3D model to the data- a challenging task unto itself. It also ignores the mass distribution of objects which are crucial in these methods.
* Getting humans to exhaustively label data is impossible because of the myriad possible ways to pick up an object. There are also inherent human biases (such as cups always picked up by the handle) that are introduced.

## Solution:
Use a self-supervising algorithm to learn to predict grasp locations from images using trial-and-error like RL. The problem setup using a Baxter robot performing _planar grasps_. Therefore, a grasp configuration is given by $(x,y,\theta)$, the position of the grasp point on the surface of the table and the angle of the grasp of the two-fingered robot.

* **Trial-and-Error Data Collection Pipeline: **
Acquire Image from Kinect $\rightarrow$ Find objects after MOG subtraction $\rightarrow$ Approach random object $\rightarrow$ Execute random grasp $\rightarrow$ Verify grasp success.
* **Learning Architecture: **
Using a CNN trained with a regression loss to learn $(x,y,\theta)$ is problematic because there are multiple possible grasp locations for each object, and CNNs are better at classification than regressing to a structured output space.
<p> Using a simple binary classification on image patches (representative of grasp position $(x,y)$) is also not feasible because depending on $\theta$, a grasp may or may not be successful. </p>
<p> Therefore, the values of $\theta$ are discretized into 18 bins ($0^\circ, 10^\circ,\dots, 170^\circ$) and given a patch, an 18-dimensional likelihood vector is estimated.</p>
* **Multi-Stage Learning: **
A network trained on random trail experience ($0^{th}$ stage) is used as a prior for another round of data collection. Objects used include those previously seen as well as novel objects to aid generalization. <p>
The network is then fine-tuned on the data collected (running it with a lower learning rate and for fewer epochs than the $0^{th}$ round). </p>
<p> The process is repeated for $k$ rounds.</p>

###Results 
Testing and evaluation is performed on 15 novel objects in several poses. To ensure methods are comparable, the performance of the binary classification is evaluated- ie, given an input and grasp configuration $(x,y,\theta)$, will the grasp succeed. 

The multi-staged Deep Learning approach yielded an accuracy of 79.5% outperforming common-sense heuristic baselines (53.4% and 59.9%) as well as learning based baselines using HoG features (kNNs: 69.4% and Linear SVM: 73.3%)